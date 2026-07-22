import { config } from "@/lib/config";
import { logger } from "@/lib/logger";

interface NotificationPayload {
  to: string;
  subject: string;
  body: string;
}

interface NotificationProvider {
  send(payload: NotificationPayload): Promise<void>;
}

// Dev / fallback provider: logs the message instead of sending it.
class ConsoleNotificationProvider implements NotificationProvider {
  async send(payload: NotificationPayload) {
    console.log("[NOTIFICATION]", JSON.stringify(payload));
  }
}

// Production provider: sends real email through the Resend HTTP API (no SDK needed).
class ResendNotificationProvider implements NotificationProvider {
  constructor(private readonly apiKey: string, private readonly from: string) {}

  async send(payload: NotificationPayload) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.from,
        to: [payload.to],
        subject: payload.subject,
        text: payload.body,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Resend API error ${res.status}: ${detail}`);
    }
  }
}

const provider: NotificationProvider = config.email.resendApiKey
  ? new ResendNotificationProvider(config.email.resendApiKey, config.email.from)
  : new ConsoleNotificationProvider();

// Wrap send so a failing email never breaks the calling request; it's logged instead.
async function safeSend(payload: NotificationPayload) {
  try {
    await provider.send(payload);
  } catch (err) {
    logger.error("Notification send failed", { to: payload.to, error: String(err) });
  }
}

export const notificationService = {
  async sendConfirmed(email: string, name: string, date: string, time: string) {
    await safeSend({
      to: email,
      subject: "Reservation Confirmed – Gilded Plates",
      body: `Dear ${name}, your reservation on ${date} at ${time} has been confirmed. We look forward to seeing you!`,
    });
  },

  async sendCancelled(email: string, name: string) {
    await safeSend({
      to: email,
      subject: "Reservation Cancelled – Gilded Plates",
      body: `Dear ${name}, your reservation has been cancelled. We hope to welcome you another time.`,
    });
  },

  async sendExpired(email: string, name: string) {
    await safeSend({
      to: email,
      subject: "Reservation Expired – Gilded Plates",
      body: `Dear ${name}, your pending reservation was not confirmed within the required time and has been automatically cancelled.`,
    });
  },
};
