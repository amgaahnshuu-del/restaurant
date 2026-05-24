import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await resolveAuthUser(request.cookies.get(AUTH_COOKIE_NAME)?.value);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to resolve current user:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
