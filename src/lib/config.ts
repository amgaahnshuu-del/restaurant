export const config = {
  businessHours: {
    openHour:  parseInt(process.env.BUSINESS_HOURS_OPEN  ?? "10", 10),
    closeHour: parseInt(process.env.BUSINESS_HOURS_CLOSE ?? "22", 10),
  },
  reservation: {
    durationMinutes:    parseInt(process.env.RESERVATION_DURATION_MINUTES ?? "120", 10),
    pendingExpiryMinutes: parseInt(process.env.PENDING_EXPIRY_MINUTES ?? "30", 10),
    websiteMinDays: parseInt(process.env.WEBSITE_MIN_DAYS ?? "0", 10),
    websiteMaxDays: parseInt(process.env.WEBSITE_MAX_DAYS ?? "10", 10),
  },
} as const;
