import { NextRequest } from "next/server";
import { reservationService } from "@server/services/reservation.service";
import { requireAuth } from "@/lib/middleware";
import { handleError, ok } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

// Both ADMIN and CUSTOMER can cancel (service enforces rules)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth(req);
    const { id } = await params;
    const reservation = await reservationService.cancel(id, auth);
    return ok({ reservation }, "Reservation cancelled");
  } catch (err) {
    return handleError(err);
  }
}
