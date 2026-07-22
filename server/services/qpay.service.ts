import { config, isQpaySandbox } from "@/lib/config";
import { logger } from "@/lib/logger";

// ─────────────────────────────────────────────────────────────────────────────
// QPay v2 merchant API client.
//
// Falls back to a SANDBOX (mock) implementation when merchant credentials are
// not configured, so the whole payment flow works end-to-end in development.
// Real QPay activates automatically once QPAY_USERNAME/PASSWORD/INVOICE_CODE
// are set — no code changes required.
// ─────────────────────────────────────────────────────────────────────────────

export interface QpayInvoiceResult {
  invoiceId: string;
  qrText: string | null;
  qrImage: string | null; // base64 PNG (no data: prefix)
  urls: { name: string; link: string }[];
}

export interface QpayCheckResult {
  paid: boolean;
  paidAmount: number;
}

interface CreateInvoiceParams {
  senderInvoiceNo: string;
  receiverCode: string;
  description: string;
  amount: number;
  // Our own reference (reservation id) echoed back on the QPay callback URL so
  // the webhook can locate the payment.
  callbackRef: string;
}

// ── Token cache ──────────────────────────────────────────────────────────────
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.token;
  }

  const basic = Buffer.from(`${config.qpay.username}:${config.qpay.password}`).toString("base64");
  const res = await fetch(`${config.qpay.baseUrl}/auth/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`QPay auth failed ${res.status}: ${detail}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in?: number };
  const ttlMs = (data.expires_in ?? 3600) * 1000;
  cachedToken = { token: data.access_token, expiresAt: now + ttlMs };
  return data.access_token;
}

// ── Real QPay ────────────────────────────────────────────────────────────────
async function createInvoiceReal(params: CreateInvoiceParams): Promise<QpayInvoiceResult> {
  const token = await getAccessToken();
  const res = await fetch(`${config.qpay.baseUrl}/invoice`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      invoice_code: config.qpay.invoiceCode,
      sender_invoice_no: params.senderInvoiceNo,
      invoice_receiver_code: params.receiverCode,
      invoice_description: params.description,
      amount: params.amount,
      callback_url: `${config.qpay.callbackUrl}?reservation=${encodeURIComponent(params.callbackRef)}`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`QPay create invoice failed ${res.status}: ${detail}`);
  }

  const data = (await res.json()) as {
    invoice_id: string;
    qr_text?: string;
    qr_image?: string;
    urls?: { name: string; link: string }[];
  };

  return {
    invoiceId: data.invoice_id,
    qrText: data.qr_text ?? null,
    qrImage: data.qr_image ?? null,
    urls: data.urls ?? [],
  };
}

async function checkPaymentReal(invoiceId: string): Promise<QpayCheckResult> {
  const token = await getAccessToken();
  const res = await fetch(`${config.qpay.baseUrl}/payment/check`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      object_type: "INVOICE",
      object_id: invoiceId,
      offset: { page_number: 1, page_limit: 100 },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`QPay check failed ${res.status}: ${detail}`);
  }

  const data = (await res.json()) as { count?: number; paid_amount?: number };
  const paidAmount = data.paid_amount ?? 0;
  return { paid: (data.count ?? 0) > 0 && paidAmount > 0, paidAmount };
}

// ── Sandbox (mock) ───────────────────────────────────────────────────────────
function createInvoiceSandbox(params: CreateInvoiceParams): QpayInvoiceResult {
  const invoiceId = `sandbox-${params.senderInvoiceNo}`;
  logger.info("QPay sandbox invoice created", { invoiceId, amount: params.amount });
  return {
    invoiceId,
    // A recognisable placeholder QR payload; the UI shows a "simulate" action.
    qrText: `SANDBOX|${invoiceId}|${params.amount}${config.payment.currency}`,
    qrImage: null,
    urls: [],
  };
}

// ── Public API ───────────────────────────────────────────────────────────────
export const qpayService = {
  isSandbox: isQpaySandbox,

  async createInvoice(params: CreateInvoiceParams): Promise<QpayInvoiceResult> {
    if (isQpaySandbox) return createInvoiceSandbox(params);
    return createInvoiceReal(params);
  },

  async checkPayment(invoiceId: string): Promise<QpayCheckResult> {
    // In sandbox, real payment status is driven by the simulate endpoint, so a
    // network check is meaningless — report unpaid and let the DB be the source.
    if (isQpaySandbox) return { paid: false, paidAmount: 0 };
    return checkPaymentReal(invoiceId);
  },
};
