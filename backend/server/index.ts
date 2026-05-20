import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 4000);

app.use(
  cors({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map((item) => item.trim()) : true,
  }),
);
app.use(express.json());

const reservationHours = new Set(["17", "18", "19", "20", "21", "22", "23"]);

const reservationSchema = z.object({
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

const cancelSchema = z.object({
  phone: z.string().min(3).max(20),
});

const listSchema = z.object({
  date: z.string().date(),
  time: z.string().optional(),
  durationHours: z.coerce.number().int().min(1).max(6).optional(),
});

const toDateOnly = (value: string) => new Date(`${value}T00:00:00`);

const getReservationBounds = (reservationDate: string, reservationTime: string, durationHours: number) => {
  const start = new Date(`${reservationDate}T${reservationTime}`);
  const end = new Date(start);
  end.setHours(end.getHours() + durationHours);
  return { start, end };
};

const overlapsReservation = (
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

const normalizeApiReservation = (reservation: {
  id: number;
  tableId: string;
  zone: string;
  tableNumber: number;
  customerName: string;
  phone: string;
  reservationDate: Date;
  reservationTime: string;
  durationHours: number;
  guests: string | null;
  capacity: string | null;
  status: "confirmed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}) => ({
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

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ ok: false, message: "Database connection failed." });
  }
});

app.get("/api/reservations", async (req, res) => {
  try {
    const { date, time, durationHours } = listSchema.parse(req.query);

    if (time && !reservationHours.has(time)) {
      return res.status(400).json({ message: "Invalid reservation hour." });
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        reservationDate: toDateOnly(date),
        status: "confirmed",
      },
      orderBy: [{ reservationTime: "asc" }, { createdAt: "desc" }],
    });

    const now = new Date();
    const normalizedReservations = reservations
      .map(normalizeApiReservation)
      .filter((reservation) => {
        const { end } = getReservationBounds(
          reservation.reservation_date,
          reservation.reservation_time,
          reservation.duration_hours,
        );

        return end > now;
      });

    const bookedTableIds = !time
      ? [...new Set(normalizedReservations.map((reservation) => reservation.table_id))]
      : [
          ...new Set(
            normalizedReservations
              .filter((reservation) =>
                overlapsReservation(
                  reservation.reservation_date,
                  reservation.reservation_time,
                  reservation.duration_hours,
                  date,
                  `${time.padStart(2, "0")}:00:00`,
                  durationHours ?? 2,
                ),
              )
              .map((reservation) => reservation.table_id),
          ),
        ];

    res.json({
      reservations: normalizedReservations,
      bookedTableIds,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid reservation query.", errors: error.flatten() });
    }

    console.error("Failed to fetch reservations:", error);
    res.status(500).json({ message: "Failed to fetch reservations." });
  }
});

app.post("/api/reservations", async (req, res) => {
  try {
    const payload = reservationSchema.parse(req.body);

    const existingReservations = await prisma.reservation.findMany({
      where: {
        tableId: payload.table_id,
        reservationDate: toDateOnly(payload.reservation_date),
        status: "confirmed",
      },
      orderBy: { createdAt: "desc" },
    });

    const conflictingReservation = existingReservations
      .map(normalizeApiReservation)
      .find((reservation) =>
        overlapsReservation(
          reservation.reservation_date,
          reservation.reservation_time,
          reservation.duration_hours,
          payload.reservation_date,
          payload.reservation_time,
          payload.duration_hours,
        ),
      );

    if (conflictingReservation) {
      return res.status(409).json({
        message: `Table ${payload.table_id} is already booked for that time.`,
        reservation: conflictingReservation,
      });
    }

    const createdReservation = await prisma.reservation.create({
      data: {
        tableId: payload.table_id,
        zone: payload.zone,
        tableNumber: payload.table_number,
        customerName: payload.customer_name.trim(),
        phone: payload.phone.trim(),
        reservationDate: toDateOnly(payload.reservation_date),
        reservationTime: payload.reservation_time,
        durationHours: payload.duration_hours,
        guests: payload.guests || null,
        capacity: payload.capacity || null,
        status: "confirmed",
      },
    });

    res.status(201).json({
      success: true,
      reservation: normalizeApiReservation(createdReservation),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid reservation payload.", errors: error.flatten() });
    }

    console.error("Failed to create reservation:", error);
    res.status(500).json({ message: "Failed to create reservation." });
  }
});

app.post("/api/reservations/cancel", async (req, res) => {
  try {
    const { phone } = cancelSchema.parse(req.body);
    const normalizedPhone = phone.trim();
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const reservations = await prisma.reservation.findMany({
      where: {
        phone: normalizedPhone,
        status: "confirmed",
        reservationDate: {
          gte: startOfToday,
        },
      },
      orderBy: [{ reservationDate: "asc" }, { reservationTime: "asc" }],
    });

    const activeReservation = reservations
      .map(normalizeApiReservation)
      .find((reservation) => {
        const { end } = getReservationBounds(
          reservation.reservation_date,
          reservation.reservation_time,
          reservation.duration_hours,
        );

        return end > today;
      });

    if (!activeReservation) {
      return res.status(404).json({ message: "No active upcoming reservation found for that phone number." });
    }

    const cancelledReservation = await prisma.reservation.update({
      where: { id: activeReservation.id },
      data: { status: "cancelled" },
    });

    res.json({
      success: true,
      reservation: normalizeApiReservation(cancelledReservation),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid cancellation payload.", errors: error.flatten() });
    }

    console.error("Failed to cancel reservation:", error);
    res.status(500).json({ message: "Failed to cancel reservation." });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
