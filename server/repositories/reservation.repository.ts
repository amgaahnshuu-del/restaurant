import type { Prisma, ReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const include = {
  table: true,
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.ReservationInclude;

// Base where-clause shared by all reads: exclude soft-deleted rows
const notDeleted: Prisma.ReservationWhereInput = { deletedAt: null };

export const reservationRepository = {
  findById: (id: string) =>
    prisma.reservation.findFirst({ where: { id, ...notDeleted }, include }),

  findAll: async (params: {
    page: number;
    limit: number;
    where?: Prisma.ReservationWhereInput;
  }) => {
    const { page, limit, where } = params;
    const skip = (page - 1) * limit;
    const combinedWhere = { ...notDeleted, ...where };

    const [data, total] = await prisma.$transaction([
      prisma.reservation.findMany({
        where: combinedWhere,
        skip,
        take: limit,
        orderBy: [{ reservationDate: "asc" }, { startTime: "asc" }],
        include,
      }),
      prisma.reservation.count({ where: combinedWhere }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  findOverlapping: (params: {
    tableId: string;
    startTime: Date;
    endTime: Date;
    excludeId?: string;
  }) =>
    prisma.reservation.findFirst({
      where: {
        tableId: params.tableId,
        id: params.excludeId ? { not: params.excludeId } : undefined,
        status: { notIn: ["CANCELLED"] },
        deletedAt: null,
        startTime: { lt: params.endTime },
        endTime:   { gt: params.startTime },
      },
    }),

  // Find PENDING reservations older than `olderThanMinutes` minutes
  findExpiredPending: (olderThanMinutes: number) => {
    const cutoff = new Date(Date.now() - olderThanMinutes * 60_000);
    return prisma.reservation.findMany({
      where: { status: "PENDING", deletedAt: null, createdAt: { lt: cutoff } },
      include,
    });
  },

  create: (data: Prisma.ReservationCreateInput) =>
    prisma.reservation.create({ data, include }),

  update: (id: string, data: Prisma.ReservationUpdateInput) =>
    prisma.reservation.update({ where: { id }, data, include }),

  // Soft delete: set deletedAt timestamp
  softDelete: (id: string) =>
    prisma.reservation.update({ where: { id }, data: { deletedAt: new Date() } }),

  // Hard delete: physical removal (admin emergency use)
  hardDelete: (id: string) =>
    prisma.reservation.delete({ where: { id } }),

  countActiveByTable: (tableId: string, statuses: ReservationStatus[]) =>
    prisma.reservation.count({
      where: { tableId, status: { in: statuses }, deletedAt: null },
    }),
};
