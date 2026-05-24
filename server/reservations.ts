import type { Reservation, ReservationStatus } from "@prisma/client";
import { z } from "zod";

export type ApiReservation = {
  id: number;
  table_id: string;
  zone: string;
  table_number: number;
  customer_name: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  duration_hours: number;
  guests: string | null;
  capacity: string | null;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
};

export const reservationHours = new Set(["17", "18", "19", "20", "21", "22", "23"]);

export const reservationSchema = z.object({
  table_id: z.string().min(1).max(20),
  zone: z.string().min(1).max(10),
  table_number: z.number().int().positive(),
  customer_name: z.string().min(1).max(100),
  phone: z.string().min(3).max(20),
  reservation_date: z.string().date(),
  reservation_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  duration_hours: z.number().int().min(1).max(6),
  guests: z.string().max(20).optional().nullable(),
  capacity: z.string().max(50).optional().nullable(),
});

export const cancelSchema = z.object({
  phone: z.string().min(3).max(20),
});

export const listSchema = z.object({
  date: z.string().date(),
  time: z.string().optional(),
  durationHours: z.coerce.number().int().min(1).max(6).optional(),
});

export const toDateOnly = (value: string) => new Date(`${value}T00:00:00`);

export const getReservationBounds = (reservationDate: string, reservationTime: string, durationHours: number) => {
  const start = new Date(`${reservationDate}T${reservationTime}`);
  const end = new Date(start);
  end.setHours(end.getHours() + durationHours);
  return { start, end };
};

export const overlapsReservation = (
  reservationDate: string,
  reservationTime: string,
  durationHours: number,
  selectedDate: string,
  selectedHour: string,
  selectedDurationHours: number,
) => {
  if (reservationDate !== selectedDate) {
    return false;
  }

  const { start, end } = getReservationBounds(reservationDate, reservationTime, durationHours);
  const selectedStart = new Date(`${selectedDate}T${selectedHour}`);
  const selectedEnd = new Date(selectedStart);
  selectedEnd.setHours(selectedEnd.getHours() + selectedDurationHours);

  return start < selectedEnd && selectedStart < end;
};

export const normalizeReservation = (reservation: Reservation): ApiReservation => ({
  id: reservation.id,
  table_id: reservation.tableId,
  zone: reservation.zone,
  table_number: reservation.tableNumber,
  customer_name: reservation.customerName,
  phone: reservation.phone,
  reservation_date: reservation.reservationDate.toISOString().slice(0, 10),
  reservation_time: reservation.reservationTime,
  duration_hours: reservation.durationHours,
  guests: reservation.guests,
  capacity: reservation.capacity,
  status: reservation.status,
  created_at: reservation.createdAt.toISOString(),
  updated_at: reservation.updatedAt.toISOString(),
});
