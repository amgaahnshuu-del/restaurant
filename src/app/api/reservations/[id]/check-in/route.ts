import { NextRequest } from "next/server";
import { reservationService } from "@server/services/reservation.service";
import { requireStaff } from "@/lib/middleware";
import { handleError, ok } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireStaff(req);
    const { id } = await params;
    const reservation = await reservationService.checkIn(id, auth);
    return ok({ reservation }, "Guest checked in");
  } catch (err) {
    return handleError(err);
  }
}
