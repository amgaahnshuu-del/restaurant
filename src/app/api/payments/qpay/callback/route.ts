import { NextRequest } from "next/server";
import { paymentService } from "@server/services/payment.service";
import { logger } from "@/lib/logger";
import { ok } from "@/lib/response";

// QPay calls this URL (with ?reservation=<id>) when an invoice is paid. We never
// trust it blindly — the service re-verifies with QPay before settling. Always
// respond 200 so QPay doesn't retry indefinitely.
async function handle(req: NextRequest) {
  const reservationId = req.nextUrl.searchParams.get("reservation");
  if (reservationId) {
    try {
      await paymentService.handleCallbackByReservation(reservationId);
    } catch (err) {
      logger.error("QPay callback processing failed", { reservationId, error: String(err) });
    }
  }
  return ok({ received: true });
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
