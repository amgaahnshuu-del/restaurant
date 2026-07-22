import { readBrowserLanguage, translateApiMessage } from "@/lib/language";

// ── Enum types (uppercase to match backend) ────────────────────────────────
export type TableStatusValue       = "AVAILABLE" | "RESERVED" | "OCCUPIED";
export type ReservationSourceValue = "WEBSITE"   | "WALK_IN"  | "PHONE";
export type ReservationStatusValue = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "CANCELLED" | "COMPLETED";

// ── Record types (matching actual API response shape) ──────────────────────
export type TableRecord = {
  id: string;
  tableNumber: number;
  capacity: number;
  status: TableStatusValue;
  createdAt: string;
  capacity_label: string;
  availableForRequestedSlot?: boolean;
  reservedTimes?: string[];
};

export type ReservationUserRecord = {
  id: string;
  name: string;
  email: string;
};

export type PaymentStatusValue = "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "CANCELLED";

export type PaymentRecord = {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: PaymentStatusValue;
  sandbox: boolean;
  qrText: string | null;
  qrImage: string | null;
  urls?: { name: string; link: string }[];
};

export type ReservationRecord = {
  id: string;
  customerName: string;
  phone: string;
  guestCount: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  source: ReservationSourceValue;
  status: ReservationStatusValue;
  note: string | null;
  tableId: string;
  table: (TableRecord & { tableNumber: number }) | null;
  user: ReservationUserRecord | null;
  createdAt: string;
  updatedAt: string;
};

// ── Query / payload types ──────────────────────────────────────────────────
export type TableQuery = {
  date?: string;
  time?: string;
};

export type CreateTablePayload = {
  tableNumber: number;
  capacity: number;
  status?: TableStatusValue;
};

export type UpdateTablePayload = Partial<CreateTablePayload>;

export type ReservationQuery = {
  page?: number;
  limit?: number;
  date?: string;
  search?: string;
  status?: ReservationStatusValue;
  source?: ReservationSourceValue;
  tableId?: string;
};

export type CreateReservationPayload = {
  customerName: string;
  phone: string;
  reservationDate: string;
  startTime: string;
  guestCount: number;
  tableId: string;
  source: ReservationSourceValue;
  note?: string | null;
};

export type UpdateReservationPayload = Partial<CreateReservationPayload>;

// ── HTTP helpers ───────────────────────────────────────────────────────────
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
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const body = await response.json();
  // Auto-unwrap { success, data } envelope used by ok() / created()
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return body.data as T;
  }
  return body as T;
};

const json = (body: unknown) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// ── API surface ────────────────────────────────────────────────────────────
export const api = {
  // Tables
  async getTables(params: TableQuery = {}) {
    const q = new URLSearchParams();
    if (params.date) q.set("date", params.date);
    if (params.time) q.set("time", params.time);
    const qs = q.toString();
    return requestJson<{ tables: TableRecord[]; availableTableIds: string[]; requestedSlot: string | null }>(
      `/api/tables${qs ? `?${qs}` : ""}`,
    );
  },

  async createTable(payload: CreateTablePayload) {
    return requestJson<{ table: TableRecord }>("/api/tables", { ...json(payload), method: "POST" });
  },

  async updateTable(id: string, payload: UpdateTablePayload) {
    return requestJson<{ table: TableRecord }>(`/api/tables/${id}`, { ...json(payload), method: "PUT" });
  },

  async deleteTable(id: string) {
    return requestJson<{ id: string }>(`/api/tables/${id}`, { method: "DELETE" });
  },

  // Reservations
  async getReservations(params: ReservationQuery = {}) {
    const q = new URLSearchParams();
    if (params.page)    q.set("page",    String(params.page));
    if (params.limit)   q.set("limit",   String(params.limit));
    if (params.date)    q.set("date",    params.date);
    if (params.search)  q.set("search",  params.search);
    if (params.status)  q.set("status",  params.status);
    if (params.source)  q.set("source",  params.source);
    if (params.tableId) q.set("tableId", params.tableId);
    const qs = q.toString();

    const result = await requestJson<{ data: ReservationRecord[]; meta: { page: number; limit: number; total: number; totalPages: number } }>(
      `/api/reservations${qs ? `?${qs}` : ""}`,
    );
    return { reservations: result.data, meta: result.meta };
  },

  async getReservation(id: string) {
    return requestJson<{ reservation: ReservationRecord }>(`/api/reservations/${id}`);
  },

  async createReservation(payload: CreateReservationPayload) {
    return requestJson<{ reservation: ReservationRecord }>(
      "/api/reservations",
      { ...json(payload), method: "POST" },
    );
  },

  async updateReservation(id: string, payload: UpdateReservationPayload) {
    return requestJson<{ reservation: ReservationRecord }>(
      `/api/reservations/${id}`,
      { ...json(payload), method: "PUT" },
    );
  },

  async deleteReservation(id: string) {
    return requestJson<{ id: string }>(`/api/reservations/${id}`, { method: "DELETE" });
  },

  async confirmReservation(id: string) {
    return requestJson<{ reservation: ReservationRecord }>(`/api/reservations/${id}/confirm`, { method: "PATCH" });
  },

  async cancelReservation(id: string) {
    return requestJson<{ reservation: ReservationRecord }>(`/api/reservations/${id}/cancel`, { method: "PATCH" });
  },

  async checkInReservation(id: string) {
    return requestJson<{ reservation: ReservationRecord }>(`/api/reservations/${id}/check-in`, { method: "PATCH" });
  },

  async completeReservation(id: string) {
    return requestJson<{ reservation: ReservationRecord }>(`/api/reservations/${id}/complete`, { method: "PATCH" });
  },

  // Payments (QPay)
  async createReservationPayment(id: string) {
    return requestJson<{ payment: PaymentRecord }>(
      `/api/reservations/${id}/payment`,
      { method: "POST" },
    );
  },

  async getReservationPayment(id: string) {
    return requestJson<{ payment: PaymentRecord }>(`/api/reservations/${id}/payment`);
  },

  async simulateReservationPayment(id: string) {
    return requestJson<{ payment: PaymentRecord }>(
      `/api/reservations/${id}/payment/simulate`,
      { method: "POST" },
    );
  },
};
