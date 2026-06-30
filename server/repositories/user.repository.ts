import type { Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const safeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export const userRepository = {
  findById: (id: string) =>
    prisma.user.findUnique({ where: { id } }),

  findByIdSafe: (id: string) =>
    prisma.user.findUnique({ where: { id }, select: safeSelect }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  create: (data: Prisma.UserCreateInput) =>
    prisma.user.create({ data, select: safeSelect }),

  exists: async (email: string): Promise<boolean> => {
    const count = await prisma.user.count({ where: { email } });
    return count > 0;
  },

  findAll: async (params: {
    role?: UserRole;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    if (params.role) where.role = params.role;
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({ where, select: safeSelect, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  updateRole: (id: string, role: UserRole) =>
    prisma.user.update({ where: { id }, data: { role }, select: safeSelect }),

  delete: (id: string) =>
    prisma.user.delete({ where: { id } }),
};
