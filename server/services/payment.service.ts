import type { Payment } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { config } from "@/lib/config";
import { logger } from "@/lib/logger";
import { paymentRepository } from "@server/repositories/payment.repository";
import { reservationRepository } from "@server/repositories/reservation.repository";
import { qpayService, type QpayInvoiceResult } from "@server/services/qpay.service";
import { syncTableStatus } from "@server/services/expiration.service";
import { notificationService } from "@server/services/notification.service";
import { toTimeString } from "@server/services/reservation.rules";
import { ForbiddenError, NotFoundError, ValidationError } from "@/lib/errors";
import type { AuthContext } from "@/lib/middleware";

export interface PaymentDto {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: Payment["status"];
  sandbox: boolean;
  qrText: string | null;
  qrImage: string | null;
  urls?: { name: string; link: string }[];
}

function toDto(payment: Payment, urls?: { name: string; link: string }[]): PaymentDto {
  return {
    id: payment.id,
    reservationId: payment.reservationId,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    sandbox: payment.sandbox,
    qrText: payment.qrText,
    qrImage: payment.qrImage,
    ...(urls && urls.length ? { urls } : {}),
  };
}

async function loadOwnedReservation(reservationId: string, auth: AuthContext) {
  const reservation = await reservationRepository.findById(reservationId);
  if (!reservation) throw new NotFoundError("Reservation");
  if (auth.role === "CUSTOMER" && reservation.userId !== auth.userId) {
    throw new ForbiddenError("Access denied");
  }
  return reservation;
}

// Mark a payment PAID and, if the reservation is still awaiting payment,
// auto-confirm it. Idempotent: a second call on a PAID payment is a no-op.
async function settlePaid(payment: Payment): Promise<Payment> {
  if (payment.status === "PAID") return payment;

  const updated = await prisma.$transaction(
    async (tx) => {
      const p = await tx.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", paidAt: new Date() },
      });

      const reservation = await tx.reservation.findUnique({ where: { id: payment.reservationId } });
      if (reservation && reservation.status === "PENDING") {
        await tx.reservation.update({ where: { id: reservation.id }, data: { status: "CONFIRMED" } });
        await tx.reservationHistory.create({
          data: {
            reservationId:   reservation.id,
            action:          "PAYMENT_CONFIRMED",
            previousStatus:  "PENDING",
            newStatus:       "CONFIRMED",
            performedBy:     "SYSTEM",
            performedByRole: "ADMIN",
            note:            `Paid ${payment.amount} ${payment.currency} via ${payment.provider}`,
          },
        });
        await syncTableStatus(reservation.tableId, tx);
      }
      return p;
    },
    { timeout: 15000 },
  );

  logger.info("Payment settled", { paymentId: payment.id, reservationId: payment.reservationId });

  // Best-effort confirmation email.
  const full = await reservationRepository.findById(payment.reservationId);
  if (full?.user?.email && full.status === "CONFIRMED") {
    const date = full.reservationDate.toISOString().slice(0, 10);
    notificationService
      .sendConfirmed(full.user.email, full.customerName, date, toTimeString(full.startTime))
      .catch(() => {});
  }

  return updated;
}

export const paymentService = {
  reservationFee: config.payment.reservationFee,

  // Create (or reuse) a QPay invoice for a website reservation's booking fee.
  async createForReservation(reservationId: string, auth: AuthContext): Promise<PaymentDto> {
    const reservation = await loadOwnedReservation(reservationId, auth);

    if (reservation.source !== "WEBSITE") {
      throw new ValidationError("Online payment applies to website reservations only");
    }

    const existing = await paymentRepository.findByReservation(reservationId);
    if (existing?.status === "PAID") return toDto(existing);

    if (reservation.status !== "PENDING") {
      throw new ValidationError("This reservation is not awaiting payment");
    }

    const amount = config.payment.reservationFee;
    const senderInvoiceNo = `${reservationId}-${Date.now()}`;
    let invoice: QpayInvoiceResult;
    try {
      invoice = await qpayService.createInvoice({
        senderInvoiceNo,
        receiverCode: reservation.phone || "GUEST",
        description: `Reservation deposit - ${reservation.customerName}`,
        amount,
        callbackRef: reservationId,
      });
    } catch (err) {
      logger.error("QPay invoice creation failed", { reservationId, error: String(err) });
      throw new ValidationError("Could not create payment invoice. Please try again.");
    }

    const data = {
      amount,
      currency: config.payment.currency,
      provider: "QPAY",
      status: "PENDING" as const,
      sandbox: qpayService.isSandbox,
      qpayInvoiceId: invoice.invoiceId,
      qrText: invoice.qrText,
      qrImage: invoice.qrImage,
    };

    const payment = existing
      ? await paymentRepository.update(existing.id, { ...data, paidAt: null })
      : await paymentRepository.create({
          ...data,
          reservation: { connect: { id: reservationId } },
        });

    return toDto(payment, invoice.urls);
  },

  // Current payment status; for real QPay it re-checks with the gateway.
  async getStatus(reservationId: string, auth: AuthContext): Promise<PaymentDto> {
    await loadOwnedReservation(reservationId, auth);
    const payment = await paymentRepository.findByReservation(reservationId);
    if (!payment) throw new NotFoundError("Payment");

    if (payment.status === "PENDING" && !payment.sandbox && payment.qpayInvoiceId) {
      const check = await qpayService.checkPayment(payment.qpayInvoiceId).catch(() => null);
      if (check?.paid) {
        return toDto(await settlePaid(payment));
      }
    }

    return toDto(payment);
  },

  // Sandbox-only: mark the reservation's payment as paid (no real gateway).
  async simulate(reservationId: string, auth: AuthContext): Promise<PaymentDto> {
    await loadOwnedReservation(reservationId, auth);
    const payment = await paymentRepository.findByReservation(reservationId);
    if (!payment) throw new NotFoundError("Payment");
    if (!payment.sandbox) throw new ForbiddenError("Simulation is only available in sandbox mode");
    return toDto(await settlePaid(payment));
  },

  // Called by the QPay callback webhook (identified by reservation ref): verify
  // with the gateway, then settle. Never trusts the callback alone.
  async handleCallbackByReservation(reservationId: string): Promise<void> {
    const payment = await paymentRepository.findByReservation(reservationId);
    if (!payment || payment.status === "PAID" || !payment.qpayInvoiceId) return;

    const check = await qpayService.checkPayment(payment.qpayInvoiceId);
    if (check.paid) {
      await settlePaid(payment);
    }
  },
};
