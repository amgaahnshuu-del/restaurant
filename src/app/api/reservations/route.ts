import { NextRequest } from "next/server";
import { createReservationSchema, reservationListSchema } from "@/lib/schemas";
import { reservationService } from "@server/services/reservation.service";
import { requireAuth } from "@/lib/middleware";
import { created, handleError, ok } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const query = reservationListSchema.parse(
      Object.fromEntries(req.nextUrl.searchParams.entries()),
    );
    const result = await reservationService.getAll(query, auth);
    return ok(result);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const input = createReservationSchema.parse(await req.json());
    const reservation = await reservationService.create(input, auth);
    return created({ reservation }, "Reservation created");
  } catch (err) {
    return handleError(err);
  }
}
