import { SignJWT, jwtVerify } from "jose";

export const AUTH_COOKIE_NAME = "gusto_session_token";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export type UserRoleValue = "ADMIN" | "STAFF" | "CUSTOMER";

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRoleValue;
}

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return new TextEncoder().encode(secret);
};

export const signToken = async (payload: JwtPayload): Promise<string> => {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
};

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const { payload } = await jwtVerify(token, getSecret());
  return {
    userId: String(payload.userId),
    email: String(payload.email),
    role: payload.role as UserRoleValue,
  };
};
