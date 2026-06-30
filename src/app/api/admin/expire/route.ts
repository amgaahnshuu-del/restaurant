import { NextRequest } from "next/server";
import { requireStaff } from "@/lib/middleware";
import { expirationService } from "@server/services/expiration.service";
import { handleError, ok } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    await requireStaff(req);
    const result = await expirationService.expirePending();
    return ok(result, `Expired ${result.expired} pending reservation(s)`);
  } catch (err) {
    return handleError(err);
  }
}
