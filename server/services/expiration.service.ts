import { prisma } from "@/lib/prisma";
import { config } from "@/lib/config";
import { logger } from "@/lib/logger";
import { reservationRepository } from "@server/repositories/reservation.repository";
import { notificationService } from "@server/services/notification.service";

// Sync a table's status from its active (non-deleted) reservations.
// Accepts the Prisma client or a transaction client (typed as any for compatibility).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function syncTableStatus(tableId: string, tx: any = prisma) {
  const inProgress = await tx.reservation.count({
    where: { tableId, status: "IN_PROGRESS", deletedAt: null },
  });
  if (inProgress > 0) {
    await tx.table.update({ where: { id: tableId }, data: { status: "OCCUPIED" } });
    return;
  }
  const confirmed = await tx.reservation.count({
    where: { tableId, status: "CONFIRMED", deletedAt: null },
  });
  if (confirmed > 0) {
    await tx.table.update({ where: { id: tableId }, data: { status: "RESERVED" } });
    return;
  }
  await tx.table.update({ where: { id: tableId }, data: { status: "AVAILABLE" } });
}

export const expirationService = {
  async expirePending(): Promise<{ expired: number }> {
    const { pendingExpiryMinutes } = config.reservation;
    const candidates = await reservationRepository.findExpiredPending(pendingExpiryMinutes);
    if (candidates.length === 0) return { expired: 0 };

    let count = 0;
    for (const r of candidates) {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.reservation.update({
            where: { id: r.id },
            data: { status: "CANCELLED" },
          });
          await tx.reservationHistory.create({
            data: {
              reservationId:   r.id,
              action:          "AUTO_EXPIRED",
              previousStatus:  r.status,
              newStatus:       "CANCELLED",
              performedBy:     "SYSTEM",
              performedByRole: "ADMIN",
              note:            `Auto-cancelled after ${pendingExpiryMinutes} min`,
            },
          });
          await syncTableStatus(r.tableId, tx);
        });

        if (r.user?.email) {
          notificationService.sendExpired(r.user.email, r.customerName).catch(() => {});
        }

        count++;
        logger.info("Reservation auto-expired", { action: "AUTO_EXPIRED", reservationId: r.id });
      } catch (err) {
        logger.error("Failed to auto-expire reservation", {
          action: "AUTO_EXPIRE_FAILED",
          reservationId: r.id,
          error: String(err),
        });
      }
    }

    return { expired: count };
  },
};
