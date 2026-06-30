import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/schemas";
import { authService } from "@server/services/auth.service";
import { AUTH_COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/jwt";
import { created, handleError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const input = registerSchema.parse(await req.json());
    const { user, token } = await authService.register(input);

    const response = created({ user }, "Registration successful");
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch (err) {
    return handleError(err);
  }
}
