import { describe, it, expect } from "vitest";
import {
  TRANSITIONS,
  isTransitionAllowed,
  buildTimes,
  toTimeString,
  validateBusinessHours,
  validateDateWindow,
} from "@server/services/reservation.rules";
import { restaurantDateString } from "@/lib/datetime";

// Add N calendar days to a "YYYY-MM-DD" string (UTC-based, no tz drift).
function addDays(dateStr: string, n: number): string {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

describe("reservation state machine", () => {
  it("allows the happy-path lifecycle transitions", () => {
    expect(isTransitionAllowed("PENDING", "CONFIRMED")).toBe(true);
    expect(isTransitionAllowed("CONFIRMED", "IN_PROGRESS")).toBe(true);
    expect(isTransitionAllowed("IN_PROGRESS", "COMPLETED")).toBe(true);
  });

  it("allows cancelling from PENDING and CONFIRMED", () => {
    expect(isTransitionAllowed("PENDING", "CANCELLED")).toBe(true);
    expect(isTransitionAllowed("CONFIRMED", "CANCELLED")).toBe(true);
  });

  it("rejects skipping states", () => {
    expect(isTransitionAllowed("PENDING", "IN_PROGRESS")).toBe(false);
    expect(isTransitionAllowed("PENDING", "COMPLETED")).toBe(false);
    expect(isTransitionAllowed("CONFIRMED", "COMPLETED")).toBe(false);
  });

  it("rejects cancelling an in-progress reservation", () => {
    expect(isTransitionAllowed("IN_PROGRESS", "CANCELLED")).toBe(false);
  });

  it("treats COMPLETED and CANCELLED as terminal", () => {
    expect(TRANSITIONS.COMPLETED).toEqual([]);
    expect(TRANSITIONS.CANCELLED).toEqual([]);
    expect(isTransitionAllowed("COMPLETED", "CONFIRMED")).toBe(false);
    expect(isTransitionAllowed("CANCELLED", "PENDING")).toBe(false);
  });
});

describe("buildTimes", () => {
  it("builds a 2-hour UTC window from date + time", () => {
    const { startTime, endTime } = buildTimes("2026-07-25", "19:00");
    expect(startTime.toISOString()).toBe("2026-07-25T19:00:00.000Z");
    expect(endTime.toISOString()).toBe("2026-07-25T21:00:00.000Z");
  });

  it("handles minutes", () => {
    const { startTime } = buildTimes("2026-07-25", "18:30");
    expect(startTime.toISOString()).toBe("2026-07-25T18:30:00.000Z");
  });
});

describe("toTimeString", () => {
  it("formats a Date as zero-padded HH:MM", () => {
    expect(toTimeString(new Date("2026-07-25T09:05:00Z"))).toBe("09:05");
    expect(toTimeString(new Date("2026-07-25T21:00:00Z"))).toBe("21:00");
  });
});

describe("validateBusinessHours (10:00–22:00)", () => {
  it("accepts a slot fully inside opening hours", () => {
    const { startTime, endTime } = buildTimes("2026-07-25", "19:00");
    expect(() => validateBusinessHours(startTime, endTime)).not.toThrow();
  });

  it("rejects a start before opening", () => {
    const { startTime, endTime } = buildTimes("2026-07-25", "09:00");
    expect(() => validateBusinessHours(startTime, endTime)).toThrow(/before/i);
  });

  it("rejects an end after closing", () => {
    const { startTime, endTime } = buildTimes("2026-07-25", "21:30"); // ends 23:30
    expect(() => validateBusinessHours(startTime, endTime)).toThrow(/closing/i);
  });
});

describe("validateDateWindow (WEBSITE, 0–10 days ahead)", () => {
  const today = restaurantDateString();

  it("ignores non-website sources", () => {
    expect(() => validateDateWindow(addDays(today, -5), "WALK_IN")).not.toThrow();
    expect(() => validateDateWindow(addDays(today, 100), "PHONE")).not.toThrow();
  });

  it("accepts today and dates within the window", () => {
    expect(() => validateDateWindow(today, "WEBSITE")).not.toThrow();
    expect(() => validateDateWindow(addDays(today, 5), "WEBSITE")).not.toThrow();
    expect(() => validateDateWindow(addDays(today, 10), "WEBSITE")).not.toThrow();
  });

  it("rejects past dates", () => {
    expect(() => validateDateWindow(addDays(today, -1), "WEBSITE")).toThrow(/in advance/i);
  });

  it("rejects dates beyond the max window", () => {
    expect(() => validateDateWindow(addDays(today, 11), "WEBSITE")).toThrow(/more than/i);
  });
});
