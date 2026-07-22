import { config } from "@/lib/config";

// Returns the restaurant's current calendar date as "YYYY-MM-DD" in its
// configured timezone (en-CA locale formats as YYYY-MM-DD).
export function restaurantDateString(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: config.restaurantTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

// UTC-midnight day range for the restaurant's current calendar day. Matches how
// `reservationDate` is stored (calendar date at UTC midnight), so "today"
// filters line up with the restaurant's local day rather than the server's UTC day.
export function restaurantTodayRangeUtc(now: Date = new Date()) {
  const date = restaurantDateString(now);
  return {
    start: new Date(`${date}T00:00:00.000Z`),
    end: new Date(`${date}T23:59:59.999Z`),
  };
}
