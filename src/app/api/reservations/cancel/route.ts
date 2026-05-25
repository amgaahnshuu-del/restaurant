import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@server/prisma";
import { getDatabaseUnavailableMessage, isDatabaseUnavailableError } from "@server/prisma-errors";
import { cancelSchema, getReservationBounds, normalizeReservation } from "@server/reservations";

export async function POST(request: NextRequest) {
  try {
    const { phone } = cancelSchema.parse(await request.json());
    const normalizedPhone = phone.trim();
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const reservations = await prisma.reservation.findMany({
      where: {
        phone: normalizedPhone,
        status: "confirmed",
        reservationDate: {
          gte: startOfToday,
        },
      },
      orderBy: [{ reservationDate: "asc" }, { reservationTime: "asc" }],
    });

    const activeReservation = reservations.map(normalizeReservation).find((reservation) => {
      const { end } = getReservationBounds(
        reservation.reservation_date,
        reservation.reservation_time,
        reservation.duration_hours,
      );

      return end > today;
    });

    if (!activeReservation) {
      return NextResponse.json(
        { message: "No active upcoming reservation found for that phone number." },
        { status: 404 },
      );
    }

    const cancelledReservation = await prisma.reservation.update({
      where: { id: activeReservation.id },
      data: { status: "cancelled" },
    });

    return NextResponse.json({
      success: true,
      reservation: normalizeReservation(cancelledReservation),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid cancellation payload.", errors: error.flatten() },
        { status: 400 },
      );
    }

    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ message: getDatabaseUnavailableMessage() }, { status: 503 });
    }

    console.error("Failed to cancel reservation:", error);
    return NextResponse.json({ message: "Failed to cancel reservation." }, { status: 500 });
  }
}
