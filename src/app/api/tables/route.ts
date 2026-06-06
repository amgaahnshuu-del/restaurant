import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import { prisma } from "@server/prisma";
import { getDatabaseUnavailableMessage, isDatabaseUnavailableError } from "@server/prisma-errors";
import {
  combineDateAndTime,
  formatDateOnly,
  getDayBounds,
  isActiveReservationStatus,
  normalizeTable,
  parseReservationDateTime,
  reservationOverlaps,
  tableCreateSchema,
  tableListQuerySchema,
} from "@server/reservations";

type TableWithAvailability = ReturnType<typeof normalizeTable> & {
  availableForRequestedSlot: boolean;
};

const getCurrentUser = async (request: NextRequest) => resolveAuthUser(request.cookies.get(AUTH_COOKIE_NAME)?.value);

const buildRequestedSlot = (query: {
  reservationDate?: string;
  date?: string;
  time?: string;
}) => {
  if (query.reservationDate) {
    return parseReservationDateTime(query.reservationDate);
  }

  if (query.date && query.time) {
    return combineDateAndTime(query.date, query.time);
  }

  return null;
};

export async function GET(request: NextRequest) {
  try {
    const query = tableListQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()));
    const requestedSlot = buildRequestedSlot(query);
    const tables = await prisma.table.findMany({
      where: query.status ? { status: query.status } : undefined,
      orderBy: { tableNumber: "asc" },
    });

    let activeReservations: Array<{ tableId: number; reservationDate: Date }> = [];

    if (requestedSlot) {
      const { start, end } = getDayBounds(formatDateOnly(requestedSlot));

      activeReservations = await prisma.reservation.findMany({
        where: {
          reservationDate: {
            gte: start,
            lt: end,
          },
          status: {
            in: ["pending", "confirmed"],
          },
        },
        select: {
          tableId: true,
          reservationDate: true,
        },
      });
    }

    const reservationsByTable = new Map<number, Date[]>();

    for (const reservation of activeReservations) {
      const items = reservationsByTable.get(reservation.tableId) ?? [];
      items.push(reservation.reservationDate);
      reservationsByTable.set(reservation.tableId, items);
    }

    const tablesWithAvailability: TableWithAvailability[] = tables.map((table) => {
      const reservations = reservationsByTable.get(table.id) ?? [];
      const availableForRequestedSlot = requestedSlot
        ? !reservations.some((reservationDate) => reservationOverlaps(reservationDate, requestedSlot))
        : table.status === "available";

      return {
        ...normalizeTable(table),
        availableForRequestedSlot,
      };
    });

    return NextResponse.json({
      tables: tablesWithAvailability,
      availableTableIds: tablesWithAvailability.filter((table) => table.availableForRequestedSlot).map((table) => table.id),
      requestedSlot: requestedSlot ? requestedSlot.toISOString() : null,
    });
  } catch (error) {
    if (error instanceof ZodError || error instanceof Error && error.message === "Invalid reservation date.") {
      return NextResponse.json({ message: "Invalid table query.", errors: error instanceof ZodError ? error.flatten() : undefined }, { status: 400 });
    }

    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ message: getDatabaseUnavailableMessage() }, { status: 503 });
    }

    console.error("Failed to fetch tables:", error);
    return NextResponse.json({ message: "Failed to fetch tables." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const payload = tableCreateSchema.parse(await request.json());
    const table = await prisma.table.create({
      data: {
        tableNumber: payload.tableNumber,
        capacity: payload.capacity,
        status: payload.status ?? "available",
      },
    });

    return NextResponse.json({ success: true, table: normalizeTable(table) }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid table payload.", errors: error.flatten() }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ message: "That table number already exists." }, { status: 409 });
      }
    }

    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ message: getDatabaseUnavailableMessage() }, { status: 503 });
    }

    console.error("Failed to create table:", error);
    return NextResponse.json({ message: "Failed to create table." }, { status: 500 });
  }
}
