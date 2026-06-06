import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  attachAuthCookie,
  createAuthToken,
  getPostLoginPath,
  parseRegisterPayload,
  registerCustomer,
} from "@server/auth";
import { getDatabaseUnavailableMessage, isDatabaseUnavailableError } from "@server/prisma-errors";
import { prisma } from "@server/prisma";

export async function POST(request: NextRequest) {
  try {
    const payload = parseRegisterPayload(await request.json());
    const normalizedEmail = payload.email.toLowerCase().trim();
    const normalizedPhone = payload.phone.trim();
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { phone: normalizedPhone }],
      },
      select: {
        email: true,
        phone: true,
      },
    });

    if (existingUser?.email === normalizedEmail) {
      return NextResponse.json({ message: "An account with that email already exists." }, { status: 409 });
    }

    if (existingUser?.phone === normalizedPhone) {
      return NextResponse.json({ message: "That phone number is already linked to another account." }, { status: 409 });
    }

    const user = await registerCustomer({
      ...payload,
      email: normalizedEmail,
      phone: normalizedPhone,
    });
    const token = await createAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          name: user.name,
        },
        redirectTo: getPostLoginPath(user.role),
      },
      { status: 201 },
    );

    attachAuthCookie(response, token);
    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid registration payload.", errors: error.flatten() }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(",") : String(error.meta?.target || "");

      if (target.includes("email")) {
        return NextResponse.json({ message: "An account with that email already exists." }, { status: 409 });
      }

      if (target.includes("phone")) {
        return NextResponse.json({ message: "That phone number is already linked to another account." }, { status: 409 });
      }

      return NextResponse.json({ message: "That account already exists." }, { status: 409 });
    }

    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ message: getDatabaseUnavailableMessage() }, { status: 503 });
    }

    console.error("Failed to register customer:", error);
    return NextResponse.json({ message: "Failed to create account." }, { status: 500 });
  }
}
