import type { ReservationStatus, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type HistoryCreateInput = {
  reservationId: string;
  action: string;
  previousStatus?: ReservationStatus | null;
  newStatus?: ReservationStatus | null;
  performedBy: string;
  performedByRole: UserRole;
  note?: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPrismaClient = any;

export const reservationHistoryRepository = {
  create: (data: HistoryCreateInput, client: AnyPrismaClient = prisma) =>
    (client as typeof prisma).reservationHistory.create({ data }),

  findByReservation: (reservationId: string) =>
    prisma.reservationHistory.findMany({
      where: { reservationId },
      orderBy: { createdAt: "asc" },
    }),
};
