import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const paymentRepository = {
  findByReservation: (reservationId: string) =>
    prisma.payment.findUnique({ where: { reservationId } }),

  findById: (id: string) => prisma.payment.findUnique({ where: { id } }),

  findByInvoiceId: (qpayInvoiceId: string) =>
    prisma.payment.findFirst({ where: { qpayInvoiceId } }),

  create: (data: Prisma.PaymentCreateInput) => prisma.payment.create({ data }),

  update: (id: string, data: Prisma.PaymentUpdateInput) =>
    prisma.payment.update({ where: { id }, data }),
};
