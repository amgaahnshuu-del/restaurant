import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/schemas";
import { authService } from "@server/services/auth.service";
import { AUTH_COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/jwt";
import { handleError, ok } from "@/lib/response";
import { getPostLoginPath } from "@server/auth";

export async function POST(req: NextRequest) {
  try {
    const input = loginSchema.parse(await req.json());
    const { user, token } = await authService.login(input);

    const redirectTo = getPostLoginPath(user.role);
    const response = ok({ user, redirectTo }, "Login successful");
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
