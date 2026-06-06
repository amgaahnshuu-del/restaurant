import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import { prisma } from "@server/prisma";
import { getDatabaseUnavailableMessage, isDatabaseUnavailableError } from "@server/prisma-errors";
import { normalizeTable, tableUpdateSchema } from "@server/reservations";

const getCurrentUser = async (request: NextRequest) => resolveAuthUser(request.cookies.get(AUTH_COOKIE_NAME)?.value);

const parseTableId = async (params: Promise<{ id: string }>) => {
  const { id } = await params;
  const tableId = Number(id);

  if (!Number.isInteger(tableId) || tableId <= 0) {
    throw new Error("Invalid table id.");
  }

  return tableId;
};

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const tableId = await parseTableId(context.params);
    const payload = tableUpdateSchema.parse(await request.json());

    if (Object.values(payload).every((value) => value === undefined)) {
      return NextResponse.json({ message: "No table fields were provided." }, { status: 400 });
    }

    const table = await prisma.table.update({
      where: { id: tableId },
      data: {
        ...(payload.tableNumber !== undefined ? { tableNumber: payload.tableNumber } : {}),
        ...(payload.capacity !== undefined ? { capacity: payload.capacity } : {}),
        ...(payload.status !== undefined ? { status: payload.status } : {}),
      },
    });

    return NextResponse.json({ success: true, table: normalizeTable(table) });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid table id.") {
      return NextResponse.json({ message: "Invalid table id." }, { status: 400 });
    }

    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid table payload.", errors: error.flatten() }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Table not found." }, { status: 404 });
      }

      if (error.code === "P2002") {
        return NextResponse.json({ message: "That table number already exists." }, { status: 409 });
      }
    }

    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ message: getDatabaseUnavailableMessage() }, { status: 503 });
    }

    console.error("Failed to update table:", error);
    return NextResponse.json({ message: "Failed to update table." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const tableId = await parseTableId(context.params);

    await prisma.table.delete({
      where: { id: tableId },
    });

    return NextResponse.json({ success: true, id: tableId });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid table id.") {
      return NextResponse.json({ message: "Invalid table id." }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Table not found." }, { status: 404 });
      }

      if (error.code === "P2003") {
        return NextResponse.json(
          { message: "Delete reservations linked to this table before removing it." },
          { status: 409 },
        );
      }
    }

    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ message: getDatabaseUnavailableMessage() }, { status: 503 });
    }

    console.error("Failed to delete table:", error);
    return NextResponse.json({ message: "Failed to delete table." }, { status: 500 });
  }
}
