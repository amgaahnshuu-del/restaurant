import { NextRequest } from "next/server";
import { userListSchema } from "@/lib/schemas";
import { userService } from "@server/services/user.service";
import { requireAdmin } from "@/lib/middleware";
import { handleError, ok } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const query = userListSchema.parse(Object.fromEntries(req.nextUrl.searchParams.entries()));
    const result = await userService.getAll(query);
    return ok(result);
  } catch (err) {
    return handleError(err);
  }
}
