// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { signToken, verifyToken, type JwtPayload } from "@/lib/jwt";

const VALID_SECRET = "test-secret-that-is-definitely-long-enough-1234567890";
const payload: JwtPayload = { userId: "u1", email: "a@b.com", role: "ADMIN" };

let original: string | undefined;

beforeEach(() => {
  original = process.env.JWT_SECRET;
});

afterEach(() => {
  process.env.JWT_SECRET = original;
});

describe("jwt sign/verify", () => {
  it("round-trips a payload", async () => {
    process.env.JWT_SECRET = VALID_SECRET;
    const token = await signToken(payload);
    const decoded = await verifyToken(token);
    expect(decoded.userId).toBe("u1");
    expect(decoded.email).toBe("a@b.com");
    expect(decoded.role).toBe("ADMIN");
  });

  it("rejects a tampered token", async () => {
    process.env.JWT_SECRET = VALID_SECRET;
    const token = await signToken(payload);
    const tampered = token.slice(0, -3) + "xxx";
    await expect(verifyToken(tampered)).rejects.toBeDefined();
  });

  it("rejects a token signed with a different secret", async () => {
    process.env.JWT_SECRET = VALID_SECRET;
    const token = await signToken(payload);
    process.env.JWT_SECRET = "another-completely-different-secret-abcdefghij";
    await expect(verifyToken(token)).rejects.toBeDefined();
  });
});

describe("jwt secret hardening", () => {
  it("refuses the known placeholder secret", async () => {
    process.env.JWT_SECRET = "replace-with-a-long-random-secret";
    await expect(signToken(payload)).rejects.toThrow(/insecure/i);
  });

  it("refuses a too-short secret", async () => {
    process.env.JWT_SECRET = "short";
    await expect(signToken(payload)).rejects.toThrow(/insecure/i);
  });

  it("refuses a missing secret", async () => {
    delete process.env.JWT_SECRET;
    await expect(signToken(payload)).rejects.toThrow(/not configured/i);
  });
});
