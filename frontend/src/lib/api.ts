const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

export type ReservationRecord = {
  id: number;
  table_id: string;
  zone: string;
  table_number: number;
  customer_name: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  duration_hours: number;
  guests?: string | null;
  capacity?: string | null;
  status: "confirmed" | "cancelled";
  created_at: string;
  updated_at: string;
};

const readErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    return data.message || "Request failed.";
  } catch {
    return "Request failed.";
  }
};

export const api = {
  async getReservations(params: { date: string; time?: string; durationHours?: number }) {
    const search = new URLSearchParams({ date: params.date });

    if (params.time) {
      search.set("time", params.time);
    }

    if (params.durationHours) {
      search.set("durationHours", String(params.durationHours));
    }

    const response = await fetch(`${API_BASE_URL}/api/reservations?${search.toString()}`);

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    return (await response.json()) as {
      reservations: ReservationRecord[];
      bookedTableIds: string[];
    };
  },

  async createReservation(payload: {
    table_id: string;
    zone: string;
    table_number: number;
    customer_name: string;
    phone: string;
    reservation_date: string;
    reservation_time: string;
    duration_hours: number;
    guests?: string;
    capacity?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/api/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    return (await response.json()) as {
      success: true;
      reservation: ReservationRecord;
    };
  },

  async cancelReservation(phone: string) {
    const response = await fetch(`${API_BASE_URL}/api/reservations/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    return (await response.json()) as {
      success: true;
      reservation: ReservationRecord;
    };
  },
};
