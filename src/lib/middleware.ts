import { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, verifyToken, type UserRoleValue } from "./jwt";
import { ForbiddenError, UnauthorizedError } from "./errors";

export interface AuthContext {
  userId: string;
  email: string;
  role: UserRoleValue;
}

export const requireAuth = async (req: NextRequest): Promise<AuthContext> => {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) throw new UnauthorizedError();

  try {
    return await verifyToken(token);
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
};

/** STAFF or ADMIN — restaurant employees */
export const requireStaff = async (req: NextRequest): Promise<AuthContext> => {
  const auth = await requireAuth(req);
  if (auth.role !== "ADMIN" && auth.role !== "STAFF") throw new ForbiddenError();
  return auth;
};

/** ADMIN only */
export const requireAdmin = async (req: NextRequest): Promise<AuthContext> => {
  const auth = await requireAuth(req);
  if (auth.role !== "ADMIN") throw new ForbiddenError();
  return auth;
};

export const getOptionalAuth = async (req: NextRequest): Promise<AuthContext | null> => {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
};

export const isStaffOrAdmin = (auth: AuthContext) =>
  auth.role === "ADMIN" || auth.role === "STAFF";
