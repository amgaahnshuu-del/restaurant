import { NextRequest } from "next/server";
import { requireStaff } from "@/lib/middleware";
import { statsService } from "@server/services/stats.service";
import { handleError, ok } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    await requireStaff(req);
    const stats = await statsService.getDashboard();
    return ok(stats);
  } catch (err) {
    return handleError(err);
  }
}
