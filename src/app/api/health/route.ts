import { NextResponse } from "next/server";
import { prisma } from "@server/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({ ok: false, message: "Database connection failed." }, { status: 500 });
  }
}
