import type { ReservationStatus } from "@prisma/client";
import { config } from "@/lib/config";
import { restaurantDateString } from "@/lib/datetime";
import { ValidationError } from "@/lib/errors";

// ─────────────────────────────────────────────────────────────────────────────
// Pure reservation business rules — no database access, so they are fully unit
// testable in isolation. DB-dependent checks (capacity, overlap) live in the
// service where the Prisma client / transaction is available.
// ─────────────────────────────────────────────────────────────────────────────

// Allowed status transitions (the reservation lifecycle state machine).
export const TRANSITIONS: Record<ReservationStatus, ReservationStatus[]> = {
  PENDING:     ["CONFIRMED", "CANCELLED"],
  CONFIRMED:   ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED:   [],
  CANCELLED:   [],
};

export function isTransitionAllowed(from: ReservationStatus, to: ReservationStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

// Build UTC start/end Date objects from a "YYYY-MM-DD" date and "HH:MM" time.
// Times are treated as wall-clock values (stored labelled UTC); end = start + duration.
export function buildTimes(date: string, time: string) {
  const { durationMinutes } = config.reservation;
  const [hours, minutes] = time.split(":").map(Number);
  const startTime = new Date(`${date}T00:00:00.000Z`);
  startTime.setUTCHours(hours, minutes ?? 0, 0, 0);
  const endTime = new Date(startTime.getTime() + durationMinutes * 60_000);
  return { startTime, endTime };
}

export function toTimeString(dt: Date) {
  return `${String(dt.getUTCHours()).padStart(2, "0")}:${String(dt.getUTCMinutes()).padStart(2, "0")}`;
}

export function validateBusinessHours(startTime: Date, endTime: Date) {
  const { openHour, closeHour } = config.businessHours;
  const sh = startTime.getUTCHours() + startTime.getUTCMinutes() / 60;
  const eh = endTime.getUTCHours()   + endTime.getUTCMinutes()   / 60;
  if (sh < openHour) {
    throw new ValidationError(`Reservations cannot start before ${openHour}:00`);
  }
  if (eh > closeHour) {
    throw new ValidationError(`Reservation would end after closing time (${closeHour}:00)`);
  }
}

export function validateDateWindow(date: string, source: string) {
  if (source !== "WEBSITE") return;
  const { websiteMinDays, websiteMaxDays } = config.reservation;
  // "Today" is the restaurant's local calendar day, not the server's UTC day.
  const today = new Date(`${restaurantDateString()}T00:00:00.000Z`);
  const target = new Date(`${date}T00:00:00.000Z`);
  const diffDays = (target.getTime() - today.getTime()) / 86_400_000;
  if (diffDays < websiteMinDays) {
    throw new ValidationError(`Website reservations must be at least ${websiteMinDays} day(s) in advance`);
  }
  if (diffDays > websiteMaxDays) {
    throw new ValidationError(`Website reservations cannot be more than ${websiteMaxDays} days in advance`);
  }
}
