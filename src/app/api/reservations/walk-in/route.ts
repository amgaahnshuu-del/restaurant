import { NextRequest } from "next/server";
import { createReservationSchema } from "@/lib/schemas";
import { reservationService } from "@server/services/reservation.service";
import { requireStaff } from "@/lib/middleware";
import { created, handleError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireStaff(req);
    const body = await req.json();
    const input = createReservationSchema.parse({ ...body, source: "WALK_IN" });
    const reservation = await reservationService.create(input, auth);
    return created({ reservation }, "Walk-in reservation created");
  } catch (err) {
    return handleError(err);
  }
}
