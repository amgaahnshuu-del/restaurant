import { ReservationSource, ReservationStatus, TableStatus, UserRole } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required").max(128),
});

export const createTableSchema = z.object({
  tableNumber: z.number({ required_error: "Table number is required" }).int().positive(),
  capacity: z.number({ required_error: "Capacity is required" }).int().min(1).max(50),
  status: z.nativeEnum(TableStatus).optional().default(TableStatus.AVAILABLE),
});

export const updateTableSchema = z
  .object({
    tableNumber: z.number().int().positive().optional(),
    capacity: z.number().int().min(1).max(50).optional(),
    status: z.nativeEnum(TableStatus).optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field is required",
  });

export const createReservationSchema = z.object({
  tableId: z.string().min(1, "Table ID is required"),
  customerName: z.string().trim().min(1, "Customer name is required").max(100),
  phone: z.string().trim().min(3, "Phone is required").max(20),
  guestCount: z.number({ required_error: "Guest count is required" }).int().min(1),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
  source: z.nativeEnum(ReservationSource).optional().default(ReservationSource.WEBSITE),
  note: z.string().max(500).optional(),
});

export const updateReservationSchema = z.object({
  tableId: z.string().min(1).optional(),
  customerName: z.string().trim().min(1).max(100).optional(),
  phone: z.string().trim().min(3).max(20).optional(),
  guestCount: z.number().int().min(1).optional(),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  source: z.nativeEnum(ReservationSource).optional(),
  note: z.string().max(500).optional(),
});

export const reservationListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.nativeEnum(ReservationStatus).optional(),
  source: z.nativeEnum(ReservationSource).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  tableId: z.string().optional(),
  search: z.string().optional(),
});

export const createStaffSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export const userListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  role: z.nativeEnum(UserRole).optional(),
  search: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTableInput = z.infer<typeof createTableSchema>;
export type UpdateTableInput = z.infer<typeof updateTableSchema>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
export type ReservationListQuery = z.infer<typeof reservationListSchema>;
export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UserListQuery = z.infer<typeof userListSchema>;
