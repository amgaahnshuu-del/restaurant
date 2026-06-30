import type { Prisma, UserRole, TableStatus, ReservationStatus, ReservationSource } from "@prisma/client";

export type { UserRole, TableStatus, ReservationStatus, ReservationSource };

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
};

export type ReservationWithRelations = Prisma.ReservationGetPayload<{
  include: {
    table: true;
    user: { select: { id: true; name: true; email: true } };
  };
}>;

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthContext {
  userId: string;
  email: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
}
