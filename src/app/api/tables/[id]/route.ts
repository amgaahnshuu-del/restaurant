import { NextRequest } from "next/server";
import { updateTableSchema } from "@/lib/schemas";
import { tableService } from "@server/services/table.service";
import { requireAdmin } from "@/lib/middleware";
import { handleError, ok } from "@/lib/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const table = await tableService.getById(id);
    return ok({ table });
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const input = updateTableSchema.parse(await req.json());
    const table = await tableService.update(id, input);
    return ok({ table }, "Table updated");
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    await tableService.delete(id);
    return ok({ id }, "Table deleted");
  } catch (err) {
    return handleError(err);
  }
}
