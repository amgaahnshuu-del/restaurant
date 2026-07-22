import { SignJWT, jwtVerify } from "jose";

export const AUTH_COOKIE_NAME = "gusto_session_token";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export type UserRoleValue = "ADMIN" | "STAFF" | "CUSTOMER";

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRoleValue;
}

const INSECURE_SECRETS = new Set([
  "replace-with-a-long-random-secret",
  "your-jwt-secret",
  "secret",
  "changeme",
]);

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  if (secret.length < 32 || INSECURE_SECRETS.has(secret)) {
    throw new Error(
      "JWT_SECRET is insecure — set a random value of at least 32 chars (openssl rand -base64 48)",
    );
  }
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
