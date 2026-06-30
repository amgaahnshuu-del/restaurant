type LogLevel = "info" | "warn" | "error";

export type LogContext = {
  userId?: string;
  role?: string;
  ip?: string;
  action?: string;
  reservationId?: string;
  [key: string]: unknown;
};

const emit = (level: LogLevel, message: string, ctx: LogContext = {}) => {
  const entry = JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...ctx });
  if (level === "error") console.error(entry);
  else console.log(entry);
};

export const logger = {
  info:  (message: string, ctx?: LogContext) => emit("info",  message, ctx),
  warn:  (message: string, ctx?: LogContext) => emit("warn",  message, ctx),
  error: (message: string, ctx?: LogContext) => emit("error", message, ctx),
};
