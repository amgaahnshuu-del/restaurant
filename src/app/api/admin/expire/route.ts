import { NextRequest } from "next/server";
import { requireStaff } from "@/lib/middleware";
import { expirationService } from "@server/services/expiration.service";
import { handleError, ok } from "@/lib/response";

// True when the request carries the shared cron secret Vercel Cron sends as
// `Authorization: Bearer <CRON_SECRET>`. Requires CRON_SECRET to be configured.
function isAuthorizedCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

async function runExpiration(req: NextRequest) {
  // Allow either the scheduled cron (secret) or a manual trigger by staff/admin.
  if (!isAuthorizedCron(req)) {
    await requireStaff(req);
  }
  const result = await expirationService.expirePending();
  return ok(result, `Expired ${result.expired} pending reservation(s)`);
}

// Vercel Cron invokes the endpoint with a GET request.
export async function GET(req: NextRequest) {
  try {
    return await runExpiration(req);
  } catch (err) {
    return handleError(err);
  }
}

// Manual trigger from the admin UI.
export async function POST(req: NextRequest) {
  try {
    return await runExpiration(req);
  } catch (err) {
    return handleError(err);
  }
}
