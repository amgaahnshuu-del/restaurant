import { prisma } from "@/lib/prisma";

export const statsService = {
  async getDashboard() {
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setUTCHours(23, 59, 59, 999);

    const todayWhere = {
      deletedAt: null,
      reservationDate: { gte: todayStart, lte: todayEnd },
    };

    const [
      totalToday,
      pending,
      confirmed,
      inProgress,
      completedToday,
      cancelledToday,
      walkInToday,
      phoneToday,
      websiteToday,
      totalTables,
      occupiedTables,
      reservedTables,
    ] = await prisma.$transaction([
      prisma.reservation.count({ where: { ...todayWhere } }),
      prisma.reservation.count({ where: { deletedAt: null, status: "PENDING" } }),
      prisma.reservation.count({ where: { deletedAt: null, status: "CONFIRMED" } }),
      prisma.reservation.count({ where: { deletedAt: null, status: "IN_PROGRESS" } }),
      prisma.reservation.count({ where: { ...todayWhere, status: "COMPLETED" } }),
      prisma.reservation.count({ where: { ...todayWhere, status: "CANCELLED" } }),
      prisma.reservation.count({ where: { ...todayWhere, source: "WALK_IN" } }),
      prisma.reservation.count({ where: { ...todayWhere, source: "PHONE" } }),
      prisma.reservation.count({ where: { ...todayWhere, source: "WEBSITE" } }),
      prisma.table.count(),
      prisma.table.count({ where: { status: "OCCUPIED" } }),
      prisma.table.count({ where: { status: "RESERVED" } }),
    ]);

    const availableTables = totalTables - occupiedTables - reservedTables;

    return {
      today: {
        total: totalToday,
        completed: completedToday,
        cancelled: cancelledToday,
        bySource: { walkIn: walkInToday, phone: phoneToday, website: websiteToday },
      },
      live: {
        pending,
        confirmed,
        inProgress,
      },
      tables: {
        total: totalTables,
        available: availableTables,
        reserved: reservedTables,
        occupied: occupiedTables,
      },
    };
  },
};
