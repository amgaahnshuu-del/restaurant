import type { ApiReservation, ApiTable } from "@server/reservations";
import { readBrowserLanguage, translateApiMessage } from "@/lib/language";

export type TableStatusValue = "available" | "reserved" | "occupied";
export type ReservationSourceValue = "website" | "walk_in" | "phone";
export type ReservationStatusValue = "pending" | "confirmed" | "cancelled" | "completed";

export type TableRecord = ApiTable & {
  availableForRequestedSlot?: boolean;
};

export type ReservationRecord = ApiReservation;

export type TableQuery = {
  status?: TableStatusValue;
  reservationDate?: string;
  date?: string;
  time?: string;
};

export type ReservationQuery = {
  page?: number;
  limit?: number;
  date?: string;
  search?: string;
  status?: ReservationStatusValue;
  source?: ReservationSourceValue;
  tableId?: number;
  time?: string;
  durationHours?: number;
};

export type CreateTablePayload = {
  tableNumber: number;
  capacity: number;
  status?: TableStatusValue;
};

export type UpdateTablePayload = Partial<CreateTablePayload>;

export type CreateReservationPayload = {
  customerName?: string;
  customer_name?: string;
  phoneNumber?: string;
  phone?: string;
  reservationDate?: string;
  reservation_date?: string;
  reservationTime?: string;
  reservation_time?: string;
  guestCount?: number;
  guest_count?: number;
  note?: string | null;
  tableId?: number;
  table_id?: number;
  source?: ReservationSourceValue;
  status?: ReservationStatusValue;
};

export type UpdateReservationPayload = Partial<CreateReservationPayload>;

const API_BASE_URL = "";

const toDateTime = (date?: string, time?: string) => {
  if (!date) {
    return "";
  }

  if (!time) {
    return date;
  }

  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return `${date}T${normalizedTime}`;
};

const readErrorMessage = async (response: Response) => {
  const language = readBrowserLanguage();

  try {
    const data = await response.json();
    return translateApiMessage(data.message || "Request failed.", language);
  } catch {
    return translateApiMessage("Request failed.", language);
  }
};

const requestJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, init);

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as T;
};

const normalizeTablePayload = (payload: CreateTablePayload | UpdateTablePayload) => ({
  ...(payload.tableNumber !== undefined ? { tableNumber: payload.tableNumber } : {}),
  ...(payload.capacity !== undefined ? { capacity: payload.capacity } : {}),
  ...(payload.status !== undefined ? { status: payload.status } : {}),
});

const normalizeReservationPayload = (payload: CreateReservationPayload | UpdateReservationPayload) => {
  const customerName = payload.customerName ?? payload.customer_name;
  const phoneNumber = payload.phoneNumber ?? payload.phone;
  const reservationDate = payload.reservationDate ?? toDateTime(payload.reservation_date, payload.reservationTime ?? payload.reservation_time);
  const guestCount = payload.guestCount ?? payload.guest_count;
  const tableId = payload.tableId ?? payload.table_id;

  return {
    ...(customerName !== undefined ? { customerName } : {}),
    ...(phoneNumber !== undefined ? { phoneNumber } : {}),
    ...(reservationDate ? { reservationDate } : {}),
    ...(guestCount !== undefined ? { guestCount } : {}),
    ...(payload.note !== undefined ? { note: payload.note } : {}),
    ...(tableId !== undefined ? { tableId } : {}),
    ...(payload.source !== undefined ? { source: payload.source } : {}),
    ...(payload.status !== undefined ? { status: payload.status } : {}),
  };
};

export const api = {
  async getTables(params: TableQuery = {}) {
    const search = new URLSearchParams();

    if (params.status) {
      search.set("status", params.status);
    }

    if (params.reservationDate) {
      search.set("reservationDate", params.reservationDate);
    }

    if (params.date) {
      search.set("date", params.date);
    }

    if (params.time) {
      search.set("time", params.time);
    }

    const query = search.toString();

    return requestJson<{
      tables: TableRecord[];
      availableTableIds: number[];
      requestedSlot: string | null;
    }>(`/api/tables${query ? `?${query}` : ""}`);
  },

  async createTable(payload: CreateTablePayload) {
    return requestJson<{
      success: true;
      table: TableRecord;
    }>("/api/tables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(normalizeTablePayload(payload)),
    });
  },

  async updateTable(id: number, payload: UpdateTablePayload) {
    return requestJson<{
      success: true;
      table: TableRecord;
    }>(`/api/tables/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(normalizeTablePayload(payload)),
    });
  },

  async deleteTable(id: number) {
    return requestJson<{ success: true; id: number }>(`/api/tables/${id}`, {
      method: "DELETE",
    });
  },

  async getReservations(params: ReservationQuery = {}) {
    const search = new URLSearchParams();

    if (params.page) {
      search.set("page", String(params.page));
    }

    if (params.limit) {
      search.set("limit", String(params.limit));
    }

    if (params.date) {
      search.set("date", params.date);
    }

    if (params.search) {
      search.set("search", params.search);
    }

    if (params.status) {
      search.set("status", params.status);
    }

    if (params.source) {
      search.set("source", params.source);
    }

    if (params.tableId) {
      search.set("tableId", String(params.tableId));
    }

    const query = search.toString();

    return requestJson<{
      reservations: ReservationRecord[];
      meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/api/reservations${query ? `?${query}` : ""}`);
  },

  async createReservation(payload: CreateReservationPayload) {
    return requestJson<{
      success: true;
      reservation: ReservationRecord;
    }>("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(normalizeReservationPayload(payload)),
    });
  },

  async updateReservation(id: number, payload: UpdateReservationPayload) {
    return requestJson<{
      success: true;
      reservation: ReservationRecord;
    }>(`/api/reservations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(normalizeReservationPayload(payload)),
    });
  },

  async deleteReservation(id: number) {
    return requestJson<{ success: true; id: number }>(`/api/reservations/${id}`, {
      method: "DELETE",
    });
  },
};
