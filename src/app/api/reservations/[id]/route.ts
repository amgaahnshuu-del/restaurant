import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import { prisma } from "@server/prisma";
import { getDatabaseUnavailableMessage, isDatabaseUnavailableError } from "@server/prisma-errors";
import {
  getDayBounds,
  isActiveReservationStatus,
  normalizeReservation,
  parseReservationDateTime,
  reservationOverlaps,
  reservationUpdateSchema,
} from "@server/reservations";

const getCurrentUser = async (request: NextRequest) => resolveAuthUser(request.cookies.get(AUTH_COOKIE_NAME)?.value);

const parseReservationId = async (params: Promise<{ id: string }>) => {
  const { id } = await params;
  const reservationId = Number(id);

  if (!Number.isInteger(reservationId) || reservationId <= 0) {
    throw new Error("Invalid reservation id.");
  }

  return reservationId;
};

const findConflictingReservation = async (
  tableId: number,
  reservationDate: Date,
  excludeId?: number,
) => {
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

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const reservationId = await parseReservationId(context.params);
    const payload = reservationUpdateSchema.parse(await request.json());

    if (Object.values(payload).every((value) => value === undefined)) {
      return NextResponse.json({ message: "No reservation fields were provided." }, { status: 400 });
    }

    const existingReservation = await prisma.reservation.findUnique({
      where: {
        id: reservationId,
      },
      include: {
        table: true,
        user: true,
      },
    });

    if (!existingReservation) {
      return NextResponse.json({ message: "Reservation not found." }, { status: 404 });
    }

    const nextTableId = payload.tableId ?? existingReservation.tableId;
    const nextReservationDate = payload.reservationDate
      ? parseReservationDateTime(payload.reservationDate)
      : existingReservation.reservationDate;
    const nextStatus = payload.status ?? existingReservation.status;
    const nextSource = payload.source ?? existingReservation.source;
    const nextNote = payload.note !== undefined ? payload.note?.trim() || null : existingReservation.note;

    if (payload.tableId !== undefined) {
      const table = await prisma.table.findUnique({
        where: {
          id: nextTableId,
        },
      });

      if (!table) {
        return NextResponse.json({ message: "Table not found." }, { status: 404 });
      }
    }

    if (isActiveReservationStatus(nextStatus)) {
      const conflictingReservation = await findConflictingReservation(nextTableId, nextReservationDate, reservationId);

      if (conflictingReservation) {
        return NextResponse.json(
          {
            message: "Another reservation already exists for that table and time.",
            reservationId: conflictingReservation.id,
          },
          { status: 409 },
        );
      }
    }

    const updatedReservation = await prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        ...(payload.customerName !== undefined ? { customerName: payload.customerName.trim() } : {}),
        ...(payload.phoneNumber !== undefined ? { phoneNumber: payload.phoneNumber.trim() } : {}),
        ...(payload.reservationDate !== undefined ? { reservationDate: nextReservationDate } : {}),
        ...(payload.guestCount !== undefined ? { guestCount: payload.guestCount } : {}),
        ...(payload.tableId !== undefined ? { tableId: nextTableId } : {}),
        ...(payload.source !== undefined ? { source: nextSource } : {}),
        ...(payload.status !== undefined ? { status: nextStatus } : {}),
        note: nextNote,
      },
      include: {
        table: true,
        user: true,
      },
    });

    return NextResponse.json({
      success: true,
      reservation: normalizeReservation(updatedReservation),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid reservation id.") {
      return NextResponse.json({ message: "Invalid reservation id." }, { status: 400 });
    }

    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid reservation payload.", errors: error.flatten() }, { status: 400 });
    }

    if (error instanceof Error && error.message === "Invalid reservation date.") {
      return NextResponse.json({ message: "Invalid reservation date." }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Reservation not found." }, { status: 404 });
      }
    }

    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ message: getDatabaseUnavailableMessage() }, { status: 503 });
    }

    console.error("Failed to update reservation:", error);
    return NextResponse.json({ message: "Failed to update reservation." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const reservationId = await parseReservationId(context.params);

    await prisma.reservation.delete({
      where: {
        id: reservationId,
      },
    });

    return NextResponse.json({ success: true, id: reservationId });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid reservation id.") {
      return NextResponse.json({ message: "Invalid reservation id." }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Reservation not found." }, { status: 404 });
      }
    }

    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ message: getDatabaseUnavailableMessage() }, { status: 503 });
    }

    console.error("Failed to delete reservation:", error);
    return NextResponse.json({ message: "Failed to delete reservation." }, { status: 500 });
  }
}
