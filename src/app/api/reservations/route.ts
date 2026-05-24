import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@server/prisma";
import {
  getReservationBounds,
  listSchema,
  normalizeReservation,
  overlapsReservation,
  reservationHours,
  reservationSchema,
  toDateOnly,
} from "@server/reservations";

export async function GET(request: NextRequest) {
  try {
    const { date, time, durationHours } = listSchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()));

    if (time && !reservationHours.has(time)) {
      return NextResponse.json({ message: "Invalid reservation hour." }, { status: 400 });
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        reservationDate: toDateOnly(date),
        status: "confirmed",
      },
      orderBy: [{ reservationTime: "asc" }, { createdAt: "desc" }],
    });

    const now = new Date();
    const normalizedReservations = reservations
      .map(normalizeReservation)
      .filter((reservation) => {
        const { end } = getReservationBounds(
          reservation.reservation_date,
          reservation.reservation_time,
          reservation.duration_hours,
        );

        return end > now;
      });

    const bookedTableIds = !time
      ? [...new Set(normalizedReservations.map((reservation) => reservation.table_id))]
      : [
          ...new Set(
            normalizedReservations
              .filter((reservation) =>
                overlapsReservation(
                  reservation.reservation_date,
                  reservation.reservation_time,
                  reservation.duration_hours,
                  date,
                  `${time.padStart(2, "0")}:00:00`,
                  durationHours ?? 2,
                ),
              )
              .map((reservation) => reservation.table_id),
          ),
        ];

    return NextResponse.json({
      reservations: normalizedReservations,
      bookedTableIds,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid reservation query.", errors: error.flatten() },
        { status: 400 },
      );
    }

    console.error("Failed to fetch reservations:", error);
    return NextResponse.json({ message: "Failed to fetch reservations." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = reservationSchema.parse(await request.json());

    const existingReservations = await prisma.reservation.findMany({
      where: {
        tableId: payload.table_id,
        reservationDate: toDateOnly(payload.reservation_date),
        status: "confirmed",
      },
      orderBy: { createdAt: "desc" },
    });

    const conflictingReservation = existingReservations
      .map(normalizeReservation)
      .find((reservation) =>
        overlapsReservation(
          reservation.reservation_date,
          reservation.reservation_time,
          reservation.duration_hours,
          payload.reservation_date,
          payload.reservation_time,
          payload.duration_hours,
        ),
      );

    if (conflictingReservation) {
      return NextResponse.json(
        {
          message: `Table ${payload.table_id} is already booked for that time.`,
          reservation: conflictingReservation,
        },
        { status: 409 },
      );
    }

    const createdReservation = await prisma.reservation.create({
      data: {
        tableId: payload.table_id,
        zone: payload.zone,
        tableNumber: payload.table_number,
        customerName: payload.customer_name.trim(),
        phone: payload.phone.trim(),
        reservationDate: toDateOnly(payload.reservation_date),
        reservationTime: payload.reservation_time,
        durationHours: payload.duration_hours,
        guests: payload.guests || null,
        capacity: payload.capacity || null,
        status: "confirmed",
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
      return NextResponse.json(
        { message: "Invalid reservation payload.", errors: error.flatten() },
        { status: 400 },
      );
    }

    console.error("Failed to create reservation:", error);
    return NextResponse.json({ message: "Failed to create reservation." }, { status: 500 });
  }
}
