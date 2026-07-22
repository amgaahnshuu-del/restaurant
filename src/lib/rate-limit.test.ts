// @vitest-environment node
import { describe, it, expect } from "vitest";
import { enforceRateLimit } from "@/lib/rate-limit";
import { RateLimitError } from "@/lib/errors";

// No Upstash env in tests → the in-memory backend is exercised.
// Unique keys per test keep the shared in-memory map isolated.

describe("enforceRateLimit (in-memory)", () => {
  it("allows requests up to the limit", async () => {
    const key = `test:allow:${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      await expect(enforceRateLimit(key, 3, 60_000)).resolves.toBeUndefined();
    }
  });

  it("throws RateLimitError once the limit is exceeded", async () => {
    const key = `test:block:${Math.random()}`;
    await enforceRateLimit(key, 2, 60_000);
    await enforceRateLimit(key, 2, 60_000);
    await expect(enforceRateLimit(key, 2, 60_000)).rejects.toBeInstanceOf(RateLimitError);
  });

  it("keeps separate counters per key", async () => {
    const a = `test:a:${Math.random()}`;
    const b = `test:b:${Math.random()}`;
    await enforceRateLimit(a, 1, 60_000);
    await expect(enforceRateLimit(a, 1, 60_000)).rejects.toBeInstanceOf(RateLimitError);
    // b is untouched by a's counter
    await expect(enforceRateLimit(b, 1, 60_000)).resolves.toBeUndefined();
  });

  it("resets after the window elapses", async () => {
    const key = `test:reset:${Math.random()}`;
    await enforceRateLimit(key, 1, 20); // 20ms window
    await expect(enforceRateLimit(key, 1, 20)).rejects.toBeInstanceOf(RateLimitError);
    await new Promise((r) => setTimeout(r, 30));
    await expect(enforceRateLimit(key, 1, 20)).resolves.toBeUndefined();
  });
});
