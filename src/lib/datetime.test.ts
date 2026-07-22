import { describe, it, expect } from "vitest";
import { restaurantDateString, restaurantTodayRangeUtc } from "@/lib/datetime";

// Default restaurant timezone is Asia/Ulaanbaatar (UTC+8, no DST).

describe("restaurantDateString", () => {
  it("returns a YYYY-MM-DD string", () => {
    expect(restaurantDateString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("stays on the same day earlier in the UTC day", () => {
    // 10:00 UTC = 18:00 in Ulaanbaatar → same calendar day
    expect(restaurantDateString(new Date("2026-07-22T10:00:00Z"))).toBe("2026-07-22");
  });

  it("rolls over to the next day once UTC passes 16:00", () => {
    // 18:00 UTC = 02:00 next day in Ulaanbaatar
    expect(restaurantDateString(new Date("2026-07-22T18:00:00Z"))).toBe("2026-07-23");
  });
});

describe("restaurantTodayRangeUtc", () => {
  it("spans the local calendar day as a UTC-midnight range", () => {
    const { start, end } = restaurantTodayRangeUtc(new Date("2026-07-22T18:00:00Z"));
    expect(start.toISOString()).toBe("2026-07-23T00:00:00.000Z");
    expect(end.toISOString()).toBe("2026-07-23T23:59:59.999Z");
  });
});
