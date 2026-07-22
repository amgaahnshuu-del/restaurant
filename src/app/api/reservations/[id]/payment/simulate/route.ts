import { NextRequest } from "next/server";
import { paymentService } from "@server/services/payment.service";
import { requireAuth } from "@/lib/middleware";
import { handleError, ok } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

// Sandbox-only: simulate a successful QPay payment for local testing.
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth(req);
    const { id } = await params;
    const payment = await paymentService.simulate(id, auth);
    return ok({ payment }, "Payment simulated");
  } catch (err) {
    return handleError(err);
  }
}
