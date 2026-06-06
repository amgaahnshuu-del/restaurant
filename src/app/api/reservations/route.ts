import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import { prisma } from "@server/prisma";
import { getDatabaseUnavailableMessage, isDatabaseUnavailableError } from "@server/prisma-errors";
import {
  combineDateAndTime,
  getDayBounds,
  isActiveReservationStatus,
  normalizeReservation,
  parseReservationDateTime,
  reservationCreateSchema,
  reservationListQuerySchema,
  reservationOverlaps,
} from "@server/reservations";

const getCurrentUser = async (request: NextRequest) => resolveAuthUser(request.cookies.get(AUTH_COOKIE_NAME)?.value);

const buildReservationFilters = (query: {
  date?: string;
  search?: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  source?: "website" | "walk_in" | "phone";
  tableId?: number;
}) => {
  const where: Prisma.ReservationWhereInput = {};

  if (query.date) {
    const { start, end } = getDayBounds(query.date);
    where.reservationDate = {
      gte: start,
      lt: end,
    };
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.source) {
    where.source = query.source;
  }

  if (query.tableId) {
    where.tableId = query.tableId;
  }

  if (query.search) {
    const numericSearch = Number(query.search);

    where.OR = [
      { customerName: { contains: query.search } },
      { phoneNumber: { contains: query.search } },
      { note: { contains: query.search } },
      ...(Number.isInteger(numericSearch)
        ? [
            { id: numericSearch },
            { table: { tableNumber: numericSearch } },
          ]
        : []),
    ];
  }

  return where;
};

const getRequestedSlot = (value: string) => {
  try {
    return parseReservationDateTime(value);
  } catch {
    return null;
  }
};

const findConflictingReservation = async (tableId: number, reservationDate: Date, excludeId?: number) => {
  const conflictingReservations = await prisma.reservation.findMany({
    where: {
      tableId,
      status: {
        in: ["pending", "confirmed"],
      },
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: {
      id: true,
      reservationDate: true,
    },
  });

  return conflictingReservations.find((reservation) => reservationOverlaps(reservation.reservationDate, reservationDate));
};

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const query = reservationListQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()));
    const where = buildReservationFilters(query);
    const skip = (query.page - 1) * query.limit;

    const [total, reservations] = await Promise.all([
      prisma.reservation.count({ where }),
      prisma.reservation.findMany({
        where,
        include: {
          table: true,
          user: true,
        },
        orderBy: [{ reservationDate: "desc" }, { createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
    ]);

    return NextResponse.json({
      reservations: reservations.map((reservation) => normalizeReservation(reservation)),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid reservation query.", errors: error.flatten() }, { status: 400 });
    }

    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ message: getDatabaseUnavailableMessage() }, { status: 503 });
    }

    console.error("Failed to fetch reservations:", error);
    return NextResponse.json({ message: "Failed to fetch reservations." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    const payload = reservationCreateSchema.parse(await request.json());
    const requestedDate = getRequestedSlot(payload.reservationDate);

    if (!requestedDate) {
      return NextResponse.json({ message: "Invalid reservation date." }, { status: 400 });
    }

    const table = await prisma.table.findUnique({
      where: {
        id: payload.tableId,
      },
    });

    if (!table) {
      return NextResponse.json({ message: "Table not found." }, { status: 404 });
    }

    const source = payload.source ?? (currentUser?.role === "admin" ? "walk_in" : "website");
    const status =
      payload.status ??
      (source === "website" ? "pending" : "confirmed");

    if (!currentUser && source !== "website") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!currentUser && status !== "pending") {
      return NextResponse.json({ message: "Website reservations must start as pending." }, { status: 400 });
    }

    if (currentUser?.role !== "admin" && source !== "website") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const conflictingReservation = await findConflictingReservation(payload.tableId, requestedDate);

    if (conflictingReservation) {
      return NextResponse.json(
        {
          message: `Table ${table.tableNumber} is already booked for that time.`,
          reservationId: conflictingReservation.id,
        },
        { status: 409 },
      );
    }

    const createdReservation = await prisma.reservation.create({
      data: {
        customerName: payload.customerName.trim(),
        phoneNumber: payload.phoneNumber.trim(),
        reservationDate: requestedDate,
        guestCount: payload.guestCount,
        note: payload.note?.trim() || null,
        tableId: payload.tableId,
        source,
        status,
        userId: currentUser?.role === "customer" ? currentUser.id : null,
      },
      include: {
        table: true,
        user: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        reservation: normalizeReservation(createdReservation),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid reservation payload.", errors: error.flatten() }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ message: "That reservation already exists." }, { status: 409 });
      }
    }

    if (error instanceof Error && error.message === "Invalid reservation date.") {
      return NextResponse.json({ message: "Invalid reservation date." }, { status: 400 });
    }

    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ message: getDatabaseUnavailableMessage() }, { status: 503 });
    }

    console.error("Failed to create reservation:", error);
    return NextResponse.json({ message: "Failed to create reservation." }, { status: 500 });
  }
}
