import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/middleware";
import { reservationService } from "@server/services/reservation.service";
import { handleError, ok } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth(req);
    const { id } = await params;
    const history = await reservationService.getHistory(id, auth);
    return ok({ history });
  } catch (err) {
    return handleError(err);
  }
}
