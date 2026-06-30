import { NextRequest } from "next/server";
import { updateUserRoleSchema } from "@/lib/schemas";
import { userService } from "@server/services/user.service";
import { requireAdmin } from "@/lib/middleware";
import { handleError, ok } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdmin(req);
    const { id } = await params;
    const { role } = updateUserRoleSchema.parse(await req.json());
    const user = await userService.updateRole(id, role, auth.userId);
    return ok({ user }, "Role updated");
  } catch (err) {
    return handleError(err);
  }
}
