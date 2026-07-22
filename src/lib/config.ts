export const config = {
  businessHours: {
    openHour:  parseInt(process.env.BUSINESS_HOURS_OPEN  ?? "10", 10),
    closeHour: parseInt(process.env.BUSINESS_HOURS_CLOSE ?? "22", 10),
  },
  reservation: {
    durationMinutes:    parseInt(process.env.RESERVATION_DURATION_MINUTES ?? "60", 10),
    pendingExpiryMinutes: parseInt(process.env.PENDING_EXPIRY_MINUTES ?? "30", 10),
    websiteMinDays: parseInt(process.env.WEBSITE_MIN_DAYS ?? "0", 10),
    websiteMaxDays: parseInt(process.env.WEBSITE_MAX_DAYS ?? "10", 10),
  },
  // IANA timezone the restaurant operates in. Used to compute "today" boundaries
  // so stats and advance-booking windows match local calendar days, not UTC.
  restaurantTimezone: process.env.RESTAURANT_TIMEZONE ?? "Asia/Ulaanbaatar",
  email: {
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    from: process.env.EMAIL_FROM ?? "Gilded Plates <onboarding@resend.dev>",
  },
  payment: {
    // Fixed booking fee (whole MNT) charged for a website reservation.
    reservationFee: parseInt(process.env.RESERVATION_FEE_MNT ?? "50000", 10),
    currency: "MNT",
  },
  qpay: {
    baseUrl: process.env.QPAY_BASE_URL ?? "https://merchant.qpay.mn/v2",
    username: process.env.QPAY_USERNAME ?? "",
    password: process.env.QPAY_PASSWORD ?? "",
    invoiceCode: process.env.QPAY_INVOICE_CODE ?? "",
    // Public URL QPay calls when an invoice is paid. Falls back to app URL.
    callbackUrl:
      process.env.QPAY_CALLBACK_URL ??
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/payments/qpay/callback`,
  },
} as const;

// QPay runs in sandbox (mock) mode until real merchant credentials are provided.
export const isQpaySandbox = !(
  config.qpay.username &&
  config.qpay.password &&
  config.qpay.invoiceCode
);
