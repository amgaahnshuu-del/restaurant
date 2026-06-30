import { NextRequest, NextResponse } from "next/server";
import { createTableSchema } from "@/lib/schemas";
import { tableService } from "@server/services/table.service";
import { requireAdmin } from "@/lib/middleware";
import { created, handleError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get("date") ?? undefined;
    const time = req.nextUrl.searchParams.get("time") ?? undefined;
    const result = await tableService.getAllWithAvailability(date, time);
    // Return flat format to match frontend expectations
    return NextResponse.json(result);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const input = createTableSchema.parse(await req.json());
    const table = await tableService.create(input);
    return created({ table }, "Table created");
  } catch (err) {
    return handleError(err);
  }
}
