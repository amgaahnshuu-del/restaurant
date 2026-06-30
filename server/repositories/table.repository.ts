import type { Prisma, TableStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const tableRepository = {
  findAll: () =>
    prisma.table.findMany({ orderBy: { tableNumber: "asc" } }),

  findById: (id: string) =>
    prisma.table.findUnique({ where: { id } }),

  findByNumber: (tableNumber: number) =>
    prisma.table.findUnique({ where: { tableNumber } }),

  create: (data: Prisma.TableCreateInput) =>
    prisma.table.create({ data }),

  update: (id: string, data: Prisma.TableUpdateInput) =>
    prisma.table.update({ where: { id }, data }),

  updateStatus: (id: string, status: TableStatus) =>
    prisma.table.update({ where: { id }, data: { status } }),

  delete: (id: string) =>
    prisma.table.delete({ where: { id } }),

  exists: async (id: string): Promise<boolean> => {
    const count = await prisma.table.count({ where: { id } });
    return count > 0;
  },
};
