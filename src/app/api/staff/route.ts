import { NextRequest } from "next/server";
import { createStaffSchema } from "@/lib/schemas";
import { userService } from "@server/services/user.service";
import { requireAdmin } from "@/lib/middleware";
import { created, handleError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const input = createStaffSchema.parse(await req.json());
    const user = await userService.createStaff(input);
    return created({ user }, "Staff account created");
  } catch (err) {
    return handleError(err);
  }
}
