import type {
  Reservation as PrismaReservation,
  ReservationSource,
  ReservationStatus,
  Table as PrismaTable,
  TableStatus,
  User as PrismaUser,
} from "@prisma/client";
import { z } from "zod";

export const DEFAULT_RESERVATION_DURATION_HOURS = 2;

export const reservationHours = new Set([
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
]);

export const tableStatusValues = ["available", "reserved", "occupied"] as const satisfies readonly TableStatus[];
export const reservationSourceValues = ["website", "walk_in", "phone"] as const satisfies readonly ReservationSource[];
export const reservationStatusValues = ["pending", "confirmed", "cancelled", "completed"] as const satisfies readonly ReservationStatus[];

const phoneSchema = z.string().trim().min(3).max(20);
const nameSchema = z.string().trim().min(1).max(100);
const noteSchema = z.string().trim().max(1000).optional().nullable();

export const tableStatusSchema = z.enum(tableStatusValues);
export const reservationSourceSchema = z.enum(reservationSourceValues);
export const reservationStatusSchema = z.enum(reservationStatusValues);

export const tableCreateSchema = z.object({
  tableNumber: z.coerce.number().int().positive(),
  capacity: z.coerce.number().int().positive(),
  status: tableStatusSchema.optional(),
});

export const tableUpdateSchema = z.object({
  tableNumber: z.coerce.number().int().positive().optional(),
  capacity: z.coerce.number().int().positive().optional(),
  status: tableStatusSchema.optional(),
});

export const tableListQuerySchema = z.object({
  status: tableStatusSchema.optional(),
  reservationDate: z.string().trim().min(1).optional(),
  date: z.string().date().optional(),
  time: z.string().trim().min(1).optional(),
});

export const reservationCreateSchema = z.object({
  customerName: nameSchema,
  phoneNumber: phoneSchema,
  reservationDate: z.string().trim().min(1),
  guestCount: z.coerce.number().int().positive(),
  note: noteSchema,
  tableId: z.coerce.number().int().positive(),
  source: reservationSourceSchema.optional(),
  status: reservationStatusSchema.optional(),
});

export const reservationUpdateSchema = z.object({
  customerName: nameSchema.optional(),
  phoneNumber: phoneSchema.optional(),
  reservationDate: z.string().trim().min(1).optional(),
  guestCount: z.coerce.number().int().positive().optional(),
  note: noteSchema,
  tableId: z.coerce.number().int().positive().optional(),
  source: reservationSourceSchema.optional(),
  status: reservationStatusSchema.optional(),
});

export const reservationListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  date: z.string().date().optional(),
  search: z.string().trim().min(1).optional(),
  status: reservationStatusSchema.optional(),
  source: reservationSourceSchema.optional(),
  tableId: z.coerce.number().int().positive().optional(),
});

export const cancelSchema = z
  .object({
    phone: phoneSchema.optional(),
    phoneNumber: phoneSchema.optional(),
  })
  .refine((value) => Boolean(value.phone || value.phoneNumber), {
    message: "Phone number is required.",
    path: ["phone"],
  });

export type ApiTable = {
  id: number;
  tableNumber: number;
  capacity: number;
  status: TableStatus;
  createdAt: string;
  updatedAt: string;
  table_number: number;
  capacity_label: string;
  created_at: string;
  updated_at: string;
};

export type ApiUser = {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
};

export type ApiReservation = {
  id: number;
  customerName: string;
  phoneNumber: string;
  reservationDate: string;
  guestCount: number;
  note: string | null;
  tableId: number;
  source: ReservationSource;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  table: ApiTable | null;
  user: ApiUser | null;
  customer_name: string;
  phone: string;
  phone_number: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  guests: string;
  duration_hours: number;
  table_id: string;
  table_number: number;
  capacity: string | null;
  zone: string;
  created_at: string;
  updated_at: string;
};

export type ReservationWithRelations = PrismaReservation & {
  table?: PrismaTable | null;
  user?: PrismaUser | null;
};

const pad = (value: number) => String(value).padStart(2, "0");

export const parseReservationDateTime = (value: string) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid reservation date.");
  }

  return parsed;
};

export const combineDateAndTime = (date: string, time: string) => {
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return parseReservationDateTime(`${date}T${normalizedTime}`);
};

export const formatDateOnly = (value: Date) =>
  `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;

export const formatTimeOnly = (value: Date) => `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;

export const toDateOnly = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error("Invalid date.");
  }

  return new Date(year, month - 1, day);
};

export const getDayBounds = (value: string) => {
  const start = toDateOnly(value);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

export const getReservationBounds = (reservationDate: Date) => {
  const start = new Date(reservationDate);
  const end = new Date(start);
  end.setHours(end.getHours() + DEFAULT_RESERVATION_DURATION_HOURS);
  return { start, end };
};

export const reservationOverlaps = (existingDate: Date, requestedDate: Date) => {
  const { start, end } = getReservationBounds(existingDate);
  const { start: requestedStart, end: requestedEnd } = getReservationBounds(requestedDate);
  return start < requestedEnd && requestedStart < end;
};

export const deriveLegacyZone = (tableNumber: number) => {
  if (tableNumber <= 4) {
    return "A";
  }

  if (tableNumber <= 8) {
    return "B";
  }

  if (tableNumber <= 12) {
    return "C";
  }

  return "D";
};

export const isActiveReservationStatus = (status: ReservationStatus) => status === "pending" || status === "confirmed";

export const normalizeTable = (table: PrismaTable): ApiTable => ({
  id: table.id,
  tableNumber: table.tableNumber,
  capacity: table.capacity,
  status: table.status,
  createdAt: table.createdAt.toISOString(),
  updatedAt: table.updatedAt.toISOString(),
  table_number: table.tableNumber,
  capacity_label: `${table.capacity} guests`,
  created_at: table.createdAt.toISOString(),
  updated_at: table.updatedAt.toISOString(),
});

export const normalizeReservation = (reservation: ReservationWithRelations): ApiReservation => {
  const table = reservation.table ? normalizeTable(reservation.table) : null;
  const tableNumber = table?.tableNumber ?? reservation.tableId;
  const dateValue = reservation.reservationDate;

  return {
    id: reservation.id,
    customerName: reservation.customerName,
    phoneNumber: reservation.phoneNumber,
    reservationDate: dateValue.toISOString(),
    guestCount: reservation.guestCount,
    note: reservation.note ?? null,
    tableId: reservation.tableId,
    source: reservation.source,
    status: reservation.status,
    createdAt: reservation.createdAt.toISOString(),
    updatedAt: reservation.updatedAt.toISOString(),
    table,
    user: reservation.user
      ? {
          id: reservation.user.id,
          email: reservation.user.email,
          name: reservation.user.name,
          phone: reservation.user.phone,
        }
      : null,
    customer_name: reservation.customerName,
    phone: reservation.phoneNumber,
    phone_number: reservation.phoneNumber,
    reservation_date: formatDateOnly(dateValue),
    reservation_time: formatTimeOnly(dateValue),
    guest_count: reservation.guestCount,
    guests: String(reservation.guestCount),
    duration_hours: DEFAULT_RESERVATION_DURATION_HOURS,
    table_id: String(reservation.tableId),
    table_number: tableNumber,
    capacity: table ? `${table.capacity} guests` : null,
    zone: deriveLegacyZone(tableNumber),
    created_at: reservation.createdAt.toISOString(),
    updated_at: reservation.updatedAt.toISOString(),
  };
};

export const normalizeReservations = (reservations: ReservationWithRelations[]) =>
  reservations.map((reservation) => normalizeReservation(reservation));

export const normalizeTables = (tables: PrismaTable[]) => tables.map((table) => normalizeTable(table));
