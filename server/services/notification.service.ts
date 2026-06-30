interface NotificationPayload {
  to: string;
  subject: string;
  body: string;
}

interface NotificationProvider {
  send(payload: NotificationPayload): Promise<void>;
}

class ConsoleNotificationProvider implements NotificationProvider {
  async send(payload: NotificationPayload) {
    console.log("[NOTIFICATION]", JSON.stringify(payload));
  }
}

const provider: NotificationProvider = new ConsoleNotificationProvider();

export const notificationService = {
  async sendConfirmed(email: string, name: string, date: string, time: string) {
    await provider.send({
      to: email,
      subject: "Reservation Confirmed – Gilded Plates",
      body: `Dear ${name}, your reservation on ${date} at ${time} has been confirmed. We look forward to seeing you!`,
    });
  },

  async sendCancelled(email: string, name: string) {
    await provider.send({
      to: email,
      subject: "Reservation Cancelled – Gilded Plates",
      body: `Dear ${name}, your reservation has been cancelled. We hope to welcome you another time.`,
    });
  },

  async sendExpired(email: string, name: string) {
    await provider.send({
      to: email,
      subject: "Reservation Expired – Gilded Plates",
      body: `Dear ${name}, your pending reservation was not confirmed within the required time and has been automatically cancelled.`,
    });
  },
};
