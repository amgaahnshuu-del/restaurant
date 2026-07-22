import type { Prisma, ReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { reservationRepository } from "@server/repositories/reservation.repository";
import { reservationHistoryRepository } from "@server/repositories/reservation-history.repository";
import { tableRepository } from "@server/repositories/table.repository";
import { syncTableStatus } from "@server/services/expiration.service";
import { notificationService } from "@server/services/notification.service";
import {
  TRANSITIONS,
  buildTimes,
  toTimeString,
  validateBusinessHours,
  validateDateWindow,
} from "@server/services/reservation.rules";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/lib/errors";
import type { AuthContext } from "@/lib/middleware";
import type {
  CreateReservationInput,
  ReservationListQuery,
  UpdateReservationInput,
} from "@/lib/schemas";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function validateCapacity(tableId: string, guestCount: number) {
  const table = await tableRepository.findById(tableId);
  if (!table) throw new NotFoundError("Table");
  if (guestCount > table.capacity) {
    throw new ValidationError(`Guest count (${guestCount}) exceeds table capacity (${table.capacity})`);
  }
  return table;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function checkConflict(params: { tableId: string; startTime: Date; endTime: Date; excludeId?: string }, tx: any = null) {
  const client = tx ?? prisma;
  const conflict = await client.reservation.findFirst({
    where: {
      tableId: params.tableId,
      id: params.excludeId ? { not: params.excludeId } : undefined,
      status: { notIn: ["CANCELLED"] },
      deletedAt: null,
      startTime: { lt: params.endTime },
      endTime:   { gt: params.startTime },
    },
  });
  if (conflict) throw new ConflictError("The table is already reserved for this time slot");
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const reservationService = {
  // ── Queries ──────────────────────────────────────────────────────────────

  async getAll(query: ReservationListQuery, auth: AuthContext) {
    const where: Prisma.ReservationWhereInput = {};

    if (auth.role === "CUSTOMER") where.userId = auth.userId;

    if (query.status)  where.status  = query.status;
    if (query.source)  where.source  = query.source;
    if (query.tableId) where.tableId = query.tableId;

    if (query.date) {
      const dayStart = new Date(`${query.date}T00:00:00.000Z`);
      const dayEnd   = new Date(`${query.date}T23:59:59.999Z`);
      where.reservationDate = { gte: dayStart, lte: dayEnd };
    }

    if (query.search) {
      where.OR = [
        { customerName: { contains: query.search, mode: "insensitive" } },
        { phone:        { contains: query.search } },
        { note:         { contains: query.search, mode: "insensitive" } },
      ];
    }

    return reservationRepository.findAll({ page: query.page, limit: query.limit, where });
  },

  async getById(id: string, auth: AuthContext) {
    const r = await reservationRepository.findById(id);
    if (!r) throw new NotFoundError("Reservation");
    if (auth.role === "CUSTOMER" && r.userId !== auth.userId) throw new ForbiddenError("Access denied");
    return r;
  },

  async getHistory(id: string, auth: AuthContext) {
    const r = await reservationRepository.findById(id);
    if (!r) throw new NotFoundError("Reservation");
    if (auth.role === "CUSTOMER" && r.userId !== auth.userId) throw new ForbiddenError("Access denied");
    return reservationHistoryRepository.findByReservation(id);
  },

  // ── Create ────────────────────────────────────────────────────────────────

  async create(input: CreateReservationInput, auth: AuthContext) {
    if (auth.role === "CUSTOMER" && input.source !== "WEBSITE") {
      throw new ForbiddenError("Customers can only make website reservations");
    }

    validateDateWindow(input.reservationDate, input.source);
    await validateCapacity(input.tableId, input.guestCount);

    const { startTime, endTime } = buildTimes(input.reservationDate, input.startTime);
    validateBusinessHours(startTime, endTime);

    const initialStatus: ReservationStatus =
      input.source === "WEBSITE" ? "PENDING" : "CONFIRMED";
    const userId = auth.role === "CUSTOMER" ? auth.userId : null;

    const reservation = await prisma.$transaction(
      async (tx) => {
        await checkConflict({ tableId: input.tableId, startTime, endTime }, tx);

        const r = await tx.reservation.create({
          data: {
            customerName:    input.customerName,
            phone:           input.phone,
            guestCount:      input.guestCount,
            reservationDate: new Date(`${input.reservationDate}T00:00:00.000Z`),
            startTime,
            endTime,
            source:          input.source,
            status:          initialStatus,
            note:            input.note ?? null,
            table: { connect: { id: input.tableId } },
            ...(userId ? { user: { connect: { id: userId } } } : {}),
          },
          include: { table: true, user: { select: { id: true, name: true, email: true } } },
        });

        await tx.reservationHistory.create({
          data: {
            reservationId:   r.id,
            action:          "CREATED",
            newStatus:       initialStatus,
            performedBy:     auth.userId,
            performedByRole: auth.role,
          },
        });

        if (initialStatus === "CONFIRMED") {
          await syncTableStatus(input.tableId, tx);
        }

        return r;
      },
      { isolationLevel: "Serializable", timeout: 15000 },
    );

    logger.info("Reservation created", {
      action: "CREATED", reservationId: reservation.id, userId: auth.userId, role: auth.role,
    });

    return reservation;
  },

  // ── Update ────────────────────────────────────────────────────────────────

  async update(id: string, input: UpdateReservationInput, auth: AuthContext) {
    const existing = await reservationRepository.findById(id);
    if (!existing) throw new NotFoundError("Reservation");

    // Role-based edit permissions
    if (auth.role === "CUSTOMER") {
      if (existing.userId !== auth.userId) throw new ForbiddenError("Access denied");
      if (existing.status !== "PENDING") throw new ValidationError("You can only edit a PENDING reservation");
    } else if (auth.role === "STAFF") {
      if (!["PENDING", "CONFIRMED"].includes(existing.status)) {
        throw new ValidationError("Staff can only edit PENDING or CONFIRMED reservations");
      }
    } else {
      // ADMIN
      if (["COMPLETED", "CANCELLED"].includes(existing.status)) {
        throw new ValidationError("Cannot edit a COMPLETED or CANCELLED reservation");
      }
    }

    const tableId          = input.tableId          ?? existing.tableId;
    const reservationDate  = input.reservationDate   ?? existing.reservationDate.toISOString().slice(0, 10);
    const startTimeStr     = input.startTime         ?? toTimeString(existing.startTime);

    if (input.guestCount !== undefined || input.tableId !== undefined) {
      await validateCapacity(tableId, input.guestCount ?? existing.guestCount);
    }

    const { startTime, endTime } = buildTimes(reservationDate, startTimeStr);

    if (input.tableId !== undefined || input.reservationDate !== undefined || input.startTime !== undefined) {
      validateBusinessHours(startTime, endTime);
    }
    if (input.reservationDate && existing.source === "WEBSITE") {
      validateDateWindow(input.reservationDate, "WEBSITE");
    }

    const updateData: Prisma.ReservationUpdateInput = {};
    if (input.customerName   !== undefined) updateData.customerName   = input.customerName;
    if (input.phone          !== undefined) updateData.phone          = input.phone;
    if (input.guestCount     !== undefined) updateData.guestCount     = input.guestCount;
    if (input.source         !== undefined) updateData.source         = input.source;
    if (input.note           !== undefined) updateData.note           = input.note;
    if (input.tableId        !== undefined) updateData.table          = { connect: { id: input.tableId } };
    if (input.reservationDate !== undefined) {
      updateData.reservationDate = new Date(`${reservationDate}T00:00:00.000Z`);
    }
    if (input.startTime !== undefined || input.reservationDate !== undefined) {
      updateData.startTime = startTime;
      updateData.endTime   = endTime;
    }

    const reservation = await prisma.$transaction(
      async (tx) => {
        if (
          input.tableId !== undefined ||
          input.reservationDate !== undefined ||
          input.startTime !== undefined
        ) {
          await checkConflict({ tableId, startTime, endTime, excludeId: id }, tx);
        }

        const r = await tx.reservation.update({
          where: { id },
          data: updateData,
          include: { table: true, user: { select: { id: true, name: true, email: true } } },
        });

        await tx.reservationHistory.create({
          data: {
            reservationId:   id,
            action:          "UPDATED",
            previousStatus:  existing.status,
            newStatus:       existing.status,
            performedBy:     auth.userId,
            performedByRole: auth.role,
          },
        });

        return r;
      },
      { isolationLevel: "Serializable", timeout: 15000 },
    );

    logger.info("Reservation updated", {
      action: "UPDATED", reservationId: id, userId: auth.userId, role: auth.role,
    });

    return reservation;
  },

  // ── Soft Delete ───────────────────────────────────────────────────────────

  async delete(id: string, auth: AuthContext) {
    const existing = await reservationRepository.findById(id);
    if (!existing) throw new NotFoundError("Reservation");
    if (existing.status === "IN_PROGRESS") {
      throw new ValidationError("Cannot delete a reservation that is currently IN_PROGRESS");
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.reservation.update({ where: { id }, data: { deletedAt: new Date() } });
        await tx.reservationHistory.create({
          data: {
            reservationId:   id,
            action:          "DELETED",
            previousStatus:  existing.status,
            performedBy:     auth.userId,
            performedByRole: auth.role,
          },
        });
        await syncTableStatus(existing.tableId, tx);
      },
      { timeout: 15000 },
    );

    logger.info("Reservation soft-deleted", {
      action: "DELETED", reservationId: id, userId: auth.userId, role: auth.role,
    });
  },

  // ── Status Transitions ────────────────────────────────────────────────────

  async transition(id: string, to: ReservationStatus, auth: AuthContext) {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) throw new NotFoundError("Reservation");

    if (["COMPLETED", "CANCELLED"].includes(reservation.status)) {
      throw new ValidationError(`Cannot transition a ${reservation.status} reservation`);
    }

    if (auth.role === "CUSTOMER") {
      if (to !== "CANCELLED") throw new ForbiddenError("Customers can only cancel reservations");
      if (reservation.userId !== auth.userId) throw new ForbiddenError("Access denied");
      if (reservation.status !== "PENDING") {
        throw new ValidationError("You can only cancel a PENDING reservation");
      }
    }

    const allowed = TRANSITIONS[reservation.status];
    if (!allowed.includes(to)) {
      throw new ValidationError(`Cannot transition from ${reservation.status} to ${to}`);
    }

    const updated = await prisma.$transaction(
      async (tx) => {
        const r = await tx.reservation.update({
          where: { id },
          data: { status: to },
          include: { table: true, user: { select: { id: true, name: true, email: true } } },
        });

        await tx.reservationHistory.create({
          data: {
            reservationId:   id,
            action:          "STATUS_CHANGED",
            previousStatus:  reservation.status,
            newStatus:       to,
            performedBy:     auth.userId,
            performedByRole: auth.role,
          },
        });

        await syncTableStatus(reservation.tableId, tx);

        return r;
      },
      { isolationLevel: "Serializable", timeout: 15000 },
    );

    // Best-effort notifications
    const email = updated.user?.email;
    if (email) {
      const date = updated.reservationDate.toISOString().slice(0, 10);
      const time = toTimeString(updated.startTime);
      if (to === "CONFIRMED") {
        notificationService.sendConfirmed(email, updated.customerName, date, time).catch(() => {});
      } else if (to === "CANCELLED") {
        notificationService.sendCancelled(email, updated.customerName).catch(() => {});
      }
    }

    logger.info("Reservation status changed", {
      action: "STATUS_CHANGED",
      reservationId: id,
      from: reservation.status,
      to,
      userId: auth.userId,
      role: auth.role,
    });

    return updated;
  },

  confirm:  (id: string, auth: AuthContext) => reservationService.transition(id, "CONFIRMED",   auth),
  cancel:   (id: string, auth: AuthContext) => reservationService.transition(id, "CANCELLED",   auth),
  checkIn:  (id: string, auth: AuthContext) => reservationService.transition(id, "IN_PROGRESS", auth),
  complete: (id: string, auth: AuthContext) => reservationService.transition(id, "COMPLETED",   auth),
};
