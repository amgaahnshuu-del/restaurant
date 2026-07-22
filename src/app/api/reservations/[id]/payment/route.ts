import { NextRequest } from "next/server";
import { paymentService } from "@server/services/payment.service";
import { requireAuth } from "@/lib/middleware";
import { created, handleError, ok } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

// Create (or reuse) the QPay invoice for this reservation's booking fee.
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth(req);
    const { id } = await params;
    const payment = await paymentService.createForReservation(id, auth);
    return created({ payment }, "Payment invoice created");
  } catch (err) {
    return handleError(err);
  }
}

// Poll the current payment status (re-checks QPay for real invoices).
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth(req);
    const { id } = await params;
    const payment = await paymentService.getStatus(id, auth);
    return ok({ payment });
  } catch (err) {
    return handleError(err);
  }
}
