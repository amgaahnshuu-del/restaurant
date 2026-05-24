import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { attachAuthCookie, authenticateUser, createAuthToken, parseLoginPayload } from "@server/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = parseLoginPayload(await request.json());
    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
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
        role: user.role,
        name: user.name,
      },
    });

    attachAuthCookie(response, token);
    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid login payload.", errors: error.flatten() }, { status: 400 });
    }

    console.error("Failed to login:", error);
    return NextResponse.json({ message: "Failed to login." }, { status: 500 });
  }
}
