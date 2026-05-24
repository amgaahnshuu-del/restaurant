import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import { prisma } from "@server/prisma";
import { normalizeReservation } from "@server/reservations";

export async function GET(request: NextRequest) {
  try {
    const user = await resolveAuthUser(request.cookies.get(AUTH_COOKIE_NAME)?.value);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const reservations = await prisma.reservation.findMany({
      orderBy: [{ reservationDate: "asc" }, { reservationTime: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      reservations: reservations.map(normalizeReservation),
    });
  } catch (error) {
    console.error("Failed to fetch admin reservations:", error);
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
}
