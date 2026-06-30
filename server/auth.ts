import type { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME, COOKIE_MAX_AGE, signToken, verifyToken } from "@/lib/jwt";

export { AUTH_COOKIE_NAME };

const userRoleSchema = z.enum(["ADMIN", "STAFF", "CUSTOMER"]);

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1).max(128),
  expectedRole: userRoleSchema.optional(),
});

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

const authUserSelect = {
  id: true,
  email: true,
  role: true,
  name: true,
} satisfies Prisma.UserSelect;

export type AuthUser = Prisma.UserGetPayload<{ select: typeof authUserSelect }>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;

export const parseLoginPayload = (payload: unknown) => loginSchema.parse(payload);
export const parseRegisterPayload = (payload: unknown) => registerSchema.parse(payload);

export const createAuthToken = async (payload: { userId: string; email: string; role: "ADMIN" | "STAFF" | "CUSTOMER" }) =>
  signToken(payload);

export const verifyAuthToken = (token: string) => verifyToken(token);

export const resolveAuthUser = async (token?: string | null): Promise<AuthUser | null> => {
  if (!token) return null;
  try {
    const { userId } = await verifyToken(token);
    return prisma.user.findUnique({ where: { id: userId }, select: authUserSelect });
  } catch {
    return null;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  return valid ? user : null;
};

export const registerCustomer = async ({ name, email, password }: RegisterPayload) => {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { name: name.trim(), email: email.toLowerCase().trim(), password: hashed, role: "CUSTOMER" },
  });
};

export const getPostLoginPath = (role: "ADMIN" | "STAFF" | "CUSTOMER") =>
  role === "ADMIN" ? "/admin/reservations" : role === "STAFF" ? "/staff/reservations" : "/";

export const attachAuthCookie = (response: NextResponse, token: string) => {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
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
