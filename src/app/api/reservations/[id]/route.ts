import { NextRequest } from "next/server";
import { updateReservationSchema } from "@/lib/schemas";
import { reservationService } from "@server/services/reservation.service";
import { requireAdmin, requireAuth } from "@/lib/middleware";
import { handleError, ok } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth(req);
    const { id } = await params;
    const reservation = await reservationService.getById(id, auth);
    return ok({ reservation });
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth(req);
    const { id } = await params;
    const input = updateReservationSchema.parse(await req.json());
    const reservation = await reservationService.update(id, input, auth);
    return ok({ reservation }, "Reservation updated");
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdmin(req);
    const { id } = await params;
    await reservationService.delete(id, auth);
    return ok({ id }, "Reservation deleted");
  } catch (err) {
    return handleError(err);
  }
}
