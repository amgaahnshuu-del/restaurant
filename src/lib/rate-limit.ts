import { NextRequest } from "next/server";
import { RateLimitError } from "@/lib/errors";
import { logger } from "@/lib/logger";

// ─────────────────────────────────────────────────────────────────────────────
// Fixed-window rate limiter with two backends:
//
//  • Upstash Redis (REST) — used automatically when UPSTASH_REDIS_REST_URL and
//    UPSTASH_REDIS_REST_TOKEN are set. Shared across all instances, so it works
//    correctly on serverless / multi-node deployments. No SDK needed (uses fetch).
//  • In-memory — the fallback for local dev / single-instance. Per-process only.
//
// If an Upstash call fails, we fall back to the in-memory check for that request
// rather than locking users out on a transient Redis error.
// ─────────────────────────────────────────────────────────────────────────────

interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();

function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, w] of buckets) {
    if (w.resetAt <= now) buckets.delete(key);
  }
}

function checkInMemory(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (existing.count >= limit) {
    const retrySec = Math.ceil((existing.resetAt - now) / 1000);
    throw new RateLimitError(`Too many attempts. Try again in ${retrySec}s.`);
  }

  existing.count += 1;
}

function upstashConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

// Fixed window via Redis: INCR the key, set its TTL on first hit, throw over limit.
async function checkUpstash(
  cfg: { url: string; token: string },
  key: string,
  limit: number,
  windowMs: number,
): Promise<void> {
  const k = `rl:${encodeURIComponent(key)}`;
  const headers = { Authorization: `Bearer ${cfg.token}` };

  const incrRes = await fetch(`${cfg.url}/incr/${k}`, { headers, cache: "no-store" });
  if (!incrRes.ok) throw new Error(`Upstash INCR ${incrRes.status}`);
  const { result: count } = (await incrRes.json()) as { result: number };

  if (count === 1) {
    // First hit in this window — arm the expiry.
    await fetch(`${cfg.url}/pexpire/${k}/${windowMs}`, { headers, cache: "no-store" });
  }

  if (count > limit) {
    throw new RateLimitError("Too many attempts. Please try again later.");
  }
}

export async function enforceRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<void> {
  const cfg = upstashConfig();
  if (!cfg) {
    checkInMemory(key, limit, windowMs);
    return;
  }

  try {
    await checkUpstash(cfg, key, limit, windowMs);
  } catch (err) {
    if (err instanceof RateLimitError) throw err;
    // Redis unavailable — degrade to in-memory instead of failing the request.
    logger.error("Rate limiter falling back to in-memory", { error: String(err) });
    checkInMemory(key, limit, windowMs);
  }
}

// Best-effort client IP from proxy headers (Vercel sets x-forwarded-for).
export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
