import { NextRequest } from "next/server";
import { authService } from "@server/services/auth.service";
import { requireAuth } from "@/lib/middleware";
import { handleError, ok } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const user = await authService.me(auth.userId);
    return ok({ user });
  } catch (err) {
    return handleError(err);
  }
}
