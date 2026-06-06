"use client";

import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Plus, RefreshCw, Save, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { api, type ReservationRecord, type ReservationStatusValue, type ReservationSourceValue, type TableRecord } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const getTodayValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const combineDateAndTime = (date: string, time: string) => {
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return `${date}T${normalizedTime}`;
};

const statusTone: Record<ReservationStatusValue, string> = {
  pending: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-300 border-red-500/20",
  completed: "bg-sky-500/10 text-sky-300 border-sky-500/20",
};

const sourceLabels: Record<ReservationSourceValue, string> = {
  website: "Website",
  walk_in: "Walk-in",
  phone: "Phone",
};

const statusDefaults: Record<ReservationSourceValue, ReservationStatusValue> = {
  website: "pending",
  walk_in: "confirmed",
  phone: "confirmed",
};

const emptyForm = {
  customerName: "",
  phoneNumber: "",
  reservationDate: getTodayValue(),
  reservationTime: "19:00",
  guestCount: "2",
  note: "",
  tableId: "",
  source: "walk_in" as ReservationSourceValue,
  status: "confirmed" as ReservationStatusValue,
};

export default function ReservationManagement() {
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [reservationTables, setReservationTables] = useState<TableRecord[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [isLoadingTables, setIsLoadingTables] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatusValue | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<ReservationSourceValue | "all">("all");
  const [form, setForm] = useState(emptyForm);
  const [statusDrafts, setStatusDrafts] = useState<Record<number, ReservationStatusValue>>({});

  const availableTableOptions = useMemo(
    () => reservationTables.filter((table) => table.availableForRequestedSlot),
    [reservationTables],
  );

  const selectedTable = useMemo(
    () => reservationTables.find((table) => table.id === Number(form.tableId)) ?? null,
    [form.tableId, reservationTables],
  );

  const loadReservationTables = async () => {
    setIsLoadingTables(true);

    try {
      const data = await api.getTables({
        date: form.reservationDate,
        time: form.reservationTime,
      });

      setReservationTables(data.tables);

      if (form.tableId && !data.availableTableIds.includes(Number(form.tableId))) {
        setForm((current) => ({ ...current, tableId: "" }));
      }
    } catch (error) {
      toast({
        title: "Unable to load tables",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      setReservationTables([]);
    } finally {
      setIsLoadingTables(false);
    }
  };

  const loadReservations = async () => {
    setIsLoadingReservations(true);

    try {
      const data = await api.getReservations({
        page,
        limit: 10,
        search: search.trim() || undefined,
        date: dateFilter || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        source: sourceFilter === "all" ? undefined : sourceFilter,
      });

      setReservations(data.reservations);
      setTotalPages(data.meta.totalPages);

      setStatusDrafts(
        data.reservations.reduce<Record<number, ReservationStatusValue>>((accumulator, reservation) => {
          accumulator[reservation.id] = reservation.status;
          return accumulator;
        }, {}),
      );
    } catch (error) {
      toast({
        title: "Unable to load reservations",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      setReservations([]);
      setTotalPages(1);
    } finally {
      setIsLoadingReservations(false);
    }
  };

  useEffect(() => {
    void loadReservationTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.reservationDate, form.reservationTime]);

  useEffect(() => {
    void loadReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, dateFilter, statusFilter, sourceFilter]);

  const handleSourceChange = (value: ReservationSourceValue) => {
    setForm((current) => ({
      ...current,
      source: value,
      status: statusDefaults[value],
    }));
  };

  const handleCreateReservation = async () => {
    if (!form.customerName.trim() || !form.phoneNumber.trim() || !form.tableId) {
      toast({
        title: "Missing fields",
        description: "Customer name, phone number, and table are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      await api.createReservation({
        customerName: form.customerName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        reservationDate: combineDateAndTime(form.reservationDate, form.reservationTime),
        guestCount: Number(form.guestCount),
        note: form.note.trim() || null,
        tableId: Number(form.tableId),
        source: form.source,
        status: form.status,
      });

      toast({
        title: "Reservation created",
        description: `${form.source === "website" ? "Website" : sourceLabels[form.source]} reservation saved.`,
      });

      setForm(emptyForm);
      await loadReservationTables();
      await loadReservations();
    } catch (error) {
      toast({
        title: "Reservation create failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusSave = async (reservation: ReservationRecord) => {
    const nextStatus = statusDrafts[reservation.id] ?? reservation.status;

    try {
      await api.updateReservation(reservation.id, { status: nextStatus });
      toast({
        title: "Reservation updated",
        description: `Reservation #${reservation.id} is now ${nextStatus}.`,
      });
      await loadReservations();
    } catch (error) {
      toast({
        title: "Reservation update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReservation = async (reservation: ReservationRecord) => {
    const confirmed = window.confirm(`Delete reservation #${reservation.id}?`);

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteReservation(reservation.id);
      toast({
        title: "Reservation deleted",
        description: `Reservation #${reservation.id} was removed.`,
      });
      await loadReservations();
    } catch (error) {
      toast({
        title: "Reservation delete failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateFilter = (setter: (value: any) => void, value: any) => {
    setPage(1);
    setter(value);
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-primary/10 bg-white/10 p-6 shadow-sm">
          <div className="font-sans text-[11px] uppercase tracking-[0.24em] text-primary/70">Create reservation</div>
          <h2 className="mt-2 text-3xl text-foreground">Register walk-ins and phone bookings</h2>
          <p className="mt-3 font-sans text-sm leading-6 text-muted-foreground">
            Select a date and time, choose a table, and save the reservation directly to the database.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 sm:col-span-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Customer name</span>
              <input
                type="text"
                value={form.customerName}
                onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              />
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Phone number</span>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              />
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Guest count</span>
              <input
                type="number"
                min="1"
                max="50"
                value={form.guestCount}
                onChange={(event) => setForm((current) => ({ ...current, guestCount: event.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              />
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Reservation date</span>
              <input
                type="date"
                value={form.reservationDate}
                onChange={(event) => setForm((current) => ({ ...current, reservationDate: event.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              />
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Reservation time</span>
              <input
                type="time"
                value={form.reservationTime}
                onChange={(event) => setForm((current) => ({ ...current, reservationTime: event.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              />
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Source</span>
              <select
                value={form.source}
                onChange={(event) => handleSourceChange(event.target.value as ReservationSourceValue)}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              >
                <option value="walk_in">Walk-in</option>
                <option value="phone">Phone</option>
                <option value="website">Website</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Status</span>
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ReservationStatusValue }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label className="block space-y-2 sm:col-span-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Table</span>
              <select
                value={form.tableId}
                onChange={(event) => setForm((current) => ({ ...current, tableId: event.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              >
                <option value="">Select a table</option>
                {availableTableOptions.map((table) => (
                  <option key={table.id} value={table.id}>
                    Table {table.tableNumber} · {table.capacity_label}
                  </option>
                ))}
              </select>
              <div className="font-sans text-xs text-muted-foreground">
                {isLoadingTables
                  ? "Loading tables..."
                  : selectedTable
                    ? `Current status: ${selectedTable.status} · ${availableTableOptions.length} tables available for this slot`
                    : `${availableTableOptions.length} tables available for this slot`}
              </div>
            </label>
            <label className="block space-y-2 sm:col-span-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Note</span>
              <textarea
                value={form.note}
                onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                rows={4}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCreateReservation}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Create reservation
            </button>
            <button
              type="button"
              onClick={loadReservationTables}
              disabled={isLoadingTables}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] transition hover:border-primary/25 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoadingTables ? <LoaderCircle className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              Refresh tables
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-primary/10 bg-white/10 p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="block space-y-2 md:col-span-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Search</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setPage(1);
                    setSearch(event.target.value);
                  }}
                  className="w-full rounded-2xl border border-border/70 bg-background/70 py-3 pl-11 pr-4 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
                  placeholder="Search customer, phone, note, or table number"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Date</span>
              <input
                type="date"
                value={dateFilter}
                onChange={(event) => updateFilter(setDateFilter, event.target.value)}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              />
            </label>

            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Status</span>
              <select
                value={statusFilter}
                onChange={(event) => updateFilter(setStatusFilter, event.target.value as ReservationStatusValue | "all")}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Source</span>
              <select
                value={sourceFilter}
                onChange={(event) => updateFilter(setSourceFilter, event.target.value as ReservationSourceValue | "all")}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
              >
                <option value="all">All</option>
                <option value="website">Website</option>
                <option value="walk_in">Walk-in</option>
                <option value="phone">Phone</option>
              </select>
            </label>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-border/70">
            {isLoadingReservations ? (
              <div className="flex items-center justify-center px-6 py-14 text-sm text-muted-foreground">
                <LoaderCircle className="mr-2 size-4 animate-spin" />
                Loading reservations...
              </div>
            ) : reservations.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border/70">
                  <thead className="bg-background/80">
                    <tr>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Guest</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Table</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-muted-foreground">When</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Source</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {reservations.map((reservation) => (
                      <tr key={reservation.id} className="bg-background/50">
                        <td className="px-4 py-4 align-top">
                          <div className="space-y-1">
                            <div className="text-base text-foreground">{reservation.customerName}</div>
                            <div className="font-sans text-sm text-muted-foreground">{reservation.phoneNumber}</div>
                            <div className="font-sans text-xs text-muted-foreground">{reservation.guestCount} guests</div>
                            {reservation.note ? <div className="font-sans text-xs text-muted-foreground">{reservation.note}</div> : null}
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="text-base text-foreground">Table {reservation.table_number}</div>
                          <div className="font-sans text-xs text-muted-foreground">
                            {reservation.capacity || "Capacity unavailable"}
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="text-base text-foreground">
                            {new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(new Date(reservation.reservationDate))}
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <Badge variant="secondary" className="capitalize">
                            {sourceLabels[reservation.source]}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <Badge className={`border capitalize ${statusTone[statusDrafts[reservation.id] ?? reservation.status]}`}>
                            {statusDrafts[reservation.id] ?? reservation.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              value={statusDrafts[reservation.id] ?? reservation.status}
                              onChange={(event) =>
                                setStatusDrafts((current) => ({
                                  ...current,
                                  [reservation.id]: event.target.value as ReservationStatusValue,
                                }))
                              }
                              className="rounded-full border border-border/70 bg-background/70 px-3 py-2 font-sans text-xs text-foreground outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="completed">Completed</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleStatusSave(reservation)}
                              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-2 font-sans text-[11px] uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                            >
                              <Save className="size-4" />
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteReservation(reservation)}
                              className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 font-sans text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20"
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-14 text-center text-sm text-muted-foreground">No reservations match the current filters.</div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1}
                className="rounded-full border border-border/70 bg-background/70 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.2em] transition hover:border-primary/25 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages}
                className="rounded-full border border-border/70 bg-background/70 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.2em] transition hover:border-primary/25 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
