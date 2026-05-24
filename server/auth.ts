import type { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "./prisma";

export const AUTH_COOKIE_NAME = "gusto_admin_token";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

export const authUserSelect = {
  id: true,
  email: true,
  role: true,
  name: true,
} satisfies Prisma.UserSelect;

export type AuthUser = Prisma.UserGetPayload<{
  select: typeof authUserSelect;
}>;

const getJwtSecret = () => {
  const value = process.env.JWT_SECRET;

  if (!value) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return new TextEncoder().encode(value);
};

export const parseLoginPayload = (payload: unknown) => loginSchema.parse(payload);

export const createAuthToken = async (payload: { userId: number; email: string; role: string }) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
};

export const verifyAuthToken = async (token: string) => {
  const { payload } = await jwtVerify(token, getJwtSecret());

  return {
    userId: Number(payload.userId),
    email: String(payload.email),
    role: String(payload.role),
  };
};

export const resolveAuthUser = async (token?: string | null): Promise<AuthUser | null> => {
  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAuthToken(token);

    return await prisma.user.findUnique({
      where: { id: payload.userId },
      select: authUserSelect,
    });
  } catch {
    return null;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return user;
};

export const attachAuthCookie = (response: NextResponse, token: string) => {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const clearAuthCookie = (response: NextResponse) => {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
};
