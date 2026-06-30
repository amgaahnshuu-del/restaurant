import { NextRequest } from "next/server";
import { userService } from "@server/services/user.service";
import { requireAdmin } from "@/lib/middleware";
import { handleError, ok } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const user = await userService.getById(id);
    return ok({ user });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdmin(req);
    const { id } = await params;
    await userService.delete(id, auth.userId);
    return ok({ id }, "User deleted");
  } catch (err) {
    return handleError(err);
  }
}
