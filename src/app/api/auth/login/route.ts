import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getDatabaseUnavailableMessage, isDatabaseUnavailableError } from "@server/prisma-errors";
import { attachAuthCookie, authenticateUser, createAuthToken, getPostLoginPath, parseLoginPayload } from "@server/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, expectedRole } = parseLoginPayload(await request.json());
    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    if (expectedRole && user.role !== expectedRole) {
      const message =
        expectedRole === "admin"
          ? "This sign-in is reserved for admin accounts."
          : "This sign-in is reserved for customer accounts.";

      return NextResponse.json({ message }, { status: 403 });
    }

    const token = await createAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        name: user.name,
      },
      redirectTo: getPostLoginPath(user.role),
    });

    attachAuthCookie(response, token);
    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid login payload.", errors: error.flatten() }, { status: 400 });
    }

    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ message: getDatabaseUnavailableMessage() }, { status: 503 });
    }

    console.error("Failed to login:", error);
    return NextResponse.json({ message: "Failed to login." }, { status: 500 });
  }
}
