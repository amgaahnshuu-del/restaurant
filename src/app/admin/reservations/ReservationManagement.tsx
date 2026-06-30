"use client";

import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, MapPin, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { api, type ReservationRecord, type ReservationStatusValue, type ReservationSourceValue, type TableRecord } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import RestaurantFloorMap from "@/components/RestaurantFloorMap";

const getTodayValue = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const statusTone: Record<ReservationStatusValue, string> = {
  PENDING:     "bg-amber-500/10 text-amber-300 border-amber-500/20",
  CONFIRMED:   "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  IN_PROGRESS: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  CANCELLED:   "bg-red-500/10 text-red-300 border-red-500/20",
  COMPLETED:   "bg-sky-500/10 text-sky-300 border-sky-500/20",
};

const sourceLabels: Record<ReservationSourceValue, string> = {
  WEBSITE:  "Website",
  WALK_IN:  "Walk-in",
  PHONE:    "Phone",
};

const emptyForm = {
  customerName:    "",
  phone:           "",
  reservationDate: getTodayValue(),
  startTime:       "19:00",
  guestCount:      "2",
  note:            "",
  tableId:         "",
  source:          "WALK_IN" as ReservationSourceValue,
};

interface Props {
  /** When false (staff), hide delete and restrict sources to WALK_IN/PHONE */
  isAdmin?: boolean;
}

export default function ReservationManagement({ isAdmin = true }: Props) {
  const [reservations,    setReservations]    = useState<ReservationRecord[]>([]);
  const [tables,          setTables]          = useState<TableRecord[]>([]);
  const [isLoadingRes,    setIsLoadingRes]    = useState(true);
  const [isLoadingTbl,    setIsLoadingTbl]    = useState(true);
  const [isSaving,        setIsSaving]        = useState(false);
  const [page,            setPage]            = useState(1);
  const [totalPages,      setTotalPages]      = useState(1);
  const [search,          setSearch]          = useState("");
  const [dateFilter,      setDateFilter]      = useState("");
  const [statusFilter,    setStatusFilter]    = useState<ReservationStatusValue | "all">("all");
  const [sourceFilter,    setSourceFilter]    = useState<ReservationSourceValue | "all">("all");
  const [form,            setForm]            = useState(emptyForm);
  const [editingId,       setEditingId]       = useState<string | null>(null);
  const [statusDrafts,    setStatusDrafts]    = useState<Record<string, ReservationStatusValue>>({});

  // Floor plan state
  const [floorSelectedId,   setFloorSelectedId]   = useState<string | null>(null);
  const [tableIdFilter,     setTableIdFilter]     = useState<string | null>(null);
  const [filteredTableNum,  setFilteredTableNum]  = useState<number | null>(null);

  const allowedSources: ReservationSourceValue[] = isAdmin
    ? ["WALK_IN", "PHONE", "WEBSITE"]
    : ["WALK_IN", "PHONE"];

  const availableTables = useMemo(
    () => tables.filter((t) => t.availableForRequestedSlot),
    [tables],
  );

  const loadTables = async () => {
    setIsLoadingTbl(true);
    try {
      const data = await api.getTables({ date: form.reservationDate, time: form.startTime });
      setTables(data.tables);
      if (form.tableId && !data.availableTableIds.includes(form.tableId)) {
        setForm((f) => ({ ...f, tableId: "" }));
      }
    } catch (err) {
      toast({ title: "Unable to load tables", description: String(err), variant: "destructive" });
    } finally {
      setIsLoadingTbl(false);
    }
  };

  const loadReservations = async () => {
    setIsLoadingRes(true);
    try {
      const data = await api.getReservations({
        page,
        limit: 10,
        search:  search.trim() || undefined,
        date:    dateFilter || undefined,
        status:  statusFilter === "all" ? undefined : statusFilter,
        source:  sourceFilter === "all" ? undefined : sourceFilter,
        tableId: tableIdFilter ?? undefined,
      });
      setReservations(data.reservations);
      setTotalPages(data.meta.totalPages);
      setStatusDrafts(
        Object.fromEntries(data.reservations.map((r) => [r.id, r.status])),
      );
    } catch (err) {
      toast({ title: "Unable to load reservations", description: String(err), variant: "destructive" });
      setReservations([]);
    } finally {
      setIsLoadingRes(false);
    }
  };

  useEffect(() => { void loadTables(); },        [form.reservationDate, form.startTime, editingId]);  // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { void loadReservations(); }, [page, search, dateFilter, statusFilter, sourceFilter, tableIdFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleEdit = (r: ReservationRecord) => {
    setEditingId(r.id);
    const d = new Date(r.startTime);
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    setForm({
      customerName:    r.customerName,
      phone:           r.phone,
      reservationDate: r.reservationDate.slice(0, 10),
      startTime:       `${hh}:${mm}`,
      guestCount:      String(r.guestCount),
      note:            r.note ?? "",
      tableId:         r.tableId,
      source:          r.source,
    });
  };

  const handleSave = async () => {
    if (!form.customerName.trim() || !form.phone.trim() || !form.tableId) {
      toast({ title: "Missing fields", description: "Name, phone and table are required.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        customerName:    form.customerName.trim(),
        phone:           form.phone.trim(),
        reservationDate: form.reservationDate,
        startTime:       form.startTime,
        guestCount:      Number(form.guestCount),
        note:            form.note.trim() || null,
        tableId:         form.tableId,
        source:          form.source,
      };
      if (editingId) {
        await api.updateReservation(editingId, payload);
        toast({ title: "Reservation updated" });
      } else {
        await api.createReservation(payload);
        toast({ title: "Reservation created", description: `${sourceLabels[form.source]} booking saved.` });
      }
      resetForm();
      await loadTables();
      await loadReservations();
    } catch (err) {
      toast({ title: "Save failed", description: String(err), variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusAction = async (r: ReservationRecord, action: "confirm" | "cancel" | "check-in" | "complete") => {
    try {
      if (action === "confirm")   await api.confirmReservation(r.id);
      if (action === "cancel")    await api.cancelReservation(r.id);
      if (action === "check-in")  await api.checkInReservation(r.id);
      if (action === "complete")  await api.completeReservation(r.id);
      toast({ title: "Status updated" });
      await loadReservations();
    } catch (err) {
      toast({ title: "Update failed", description: String(err), variant: "destructive" });
    }
  };

  const handleDelete = async (r: ReservationRecord) => {
    if (!window.confirm(`Delete reservation for ${r.customerName}?`)) return;
    try {
      await api.deleteReservation(r.id);
      toast({ title: "Reservation deleted" });
      await loadReservations();
    } catch (err) {
      toast({ title: "Delete failed", description: String(err), variant: "destructive" });
    }
  };

  const setFilter = <T,>(setter: (v: T) => void, value: T) => { setPage(1); setter(value); };

  // Floor map: click handler
  const handleFloorSelect = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;

    if (table.availableForRequestedSlot) {
      // Available → pre-select in the booking form
      setForm((f) => ({ ...f, tableId }));
      setFloorSelectedId(tableId);
      setTableIdFilter(null);
      setFilteredTableNum(null);
    } else {
      // Reserved → toggle reservation list filter for that table
      const isAlreadySelected = tableIdFilter === tableId;
      setFloorSelectedId(isAlreadySelected ? null : tableId);
      setTableIdFilter(isAlreadySelected ? null : tableId);
      setFilteredTableNum(isAlreadySelected ? null : table.tableNumber);
      setPage(1);
    }
  };

  const clearTableFilter = () => {
    setFloorSelectedId(null);
    setTableIdFilter(null);
    setFilteredTableNum(null);
    setPage(1);
  };

  // Sync floor highlight when form table changes via dropdown
  const floorHighlightId = floorSelectedId ?? (form.tableId || null);

  return (
    <div className="space-y-6">

      {/* ── Floor Plan ── */}
      <div className="rounded-[2rem] border border-primary/10 bg-white/10 p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-sans text-[11px] uppercase tracking-[0.24em] text-primary/70">Floor plan</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {form.reservationDate} · {form.startTime} — click a table to book it or view its reservations
            </p>
          </div>
          {filteredTableNum && (
            <button
              type="button"
              onClick={clearTableFilter}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 font-sans text-[11px] text-foreground transition hover:bg-primary/10"
            >
              <MapPin className="size-3 text-primary/70" />
              Table {filteredTableNum}
              <X className="size-3 text-muted-foreground" />
            </button>
          )}
        </div>

        {isLoadingTbl ? (
          <div className="flex items-center justify-center gap-2 py-14 text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" />
            <span className="text-sm">Loading floor plan…</span>
          </div>
        ) : tables.length > 0 ? (
          <RestaurantFloorMap
            tables={tables}
            selectedTableId={floorHighlightId}
            onSelect={handleFloorSelect}
            allowReservedClick
          />
        ) : (
          <p className="py-14 text-center text-sm text-muted-foreground">
            No table data — select a date and time in the booking form below.
          </p>
        )}
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* ── Create / Edit form ── */}
        <div className="rounded-[2rem] border border-primary/10 bg-white/10 p-6 shadow-sm">
          <div className="font-sans text-[11px] uppercase tracking-[0.24em] text-primary/70">
            {editingId ? "Edit reservation" : "New reservation"}
          </div>
          <h2 className="mt-2 text-3xl text-foreground">
            {editingId ? "Update booking details" : "Register walk-ins and phone bookings"}
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 sm:col-span-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Customer name</span>
              <input type="text" value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40" />
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Phone</span>
              <input type="tel" value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40" />
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Guests</span>
              <input type="number" min="1" max="50" value={form.guestCount}
                onChange={(e) => setForm((f) => ({ ...f, guestCount: e.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40" />
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Date</span>
              <input type="date" value={form.reservationDate}
                onChange={(e) => setForm((f) => ({ ...f, reservationDate: e.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40" />
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Time</span>
              <input type="time" value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40" />
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Source</span>
              <select value={form.source}
                onChange={(e) => setForm((f) => ({ ...f, source: e.target.value as ReservationSourceValue }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40">
                {allowedSources.map((s) => <option key={s} value={s}>{sourceLabels[s]}</option>)}
              </select>
            </label>
            <label className="block space-y-2 sm:col-span-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Table</span>
              <select value={form.tableId}
                onChange={(e) => {
                  const id = e.target.value;
                  setForm((f) => ({ ...f, tableId: id }));
                  setFloorSelectedId(id || null);
                }}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40">
                <option value="">Select a table</option>
                {availableTables.map((t) => (
                  <option key={t.id} value={t.id}>Table {t.tableNumber} · {t.capacity_label}</option>
                ))}
              </select>
              <p className="font-sans text-xs text-muted-foreground">
                {isLoadingTbl ? "Loading…" : `${availableTables.length} tables available for this slot`}
              </p>
            </label>
            <label className="block space-y-2 sm:col-span-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Note</span>
              <textarea value={form.note} rows={3}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40" />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={handleSave} disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition hover:brightness-105 disabled:opacity-50">
              {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {editingId ? "Save changes" : "Create reservation"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] transition hover:border-primary/25">
                Cancel edit
              </button>
            )}
            <button type="button" onClick={loadTables} disabled={isLoadingTbl}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] transition hover:border-primary/25 disabled:opacity-50">
              {isLoadingTbl ? <LoaderCircle className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              Refresh tables
            </button>
          </div>
        </div>

        {/* ── Reservation list ── */}
        <div className="rounded-[2rem] border border-primary/10 bg-white/10 p-6 shadow-sm">
          {/* Filter header */}
          {filteredTableNum ? (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary/70" />
                <span className="font-sans text-sm text-foreground">
                  Reservations for <strong>Table {filteredTableNum}</strong>
                </span>
              </div>
              <button type="button" onClick={clearTableFilter}
                className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1 font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary/25 hover:text-foreground">
                <X className="size-3" /> Clear
              </button>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="block space-y-2 md:col-span-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Search</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={search}
                  onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                  className="w-full rounded-2xl border border-border/70 bg-background/70 py-3 pl-11 pr-4 font-sans text-sm text-foreground outline-none transition focus:border-primary/40"
                  placeholder="Name, phone, note..." />
              </div>
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Date</span>
              <input type="date" value={dateFilter}
                onChange={(e) => setFilter(setDateFilter, e.target.value)}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40" />
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Status</span>
              <select value={statusFilter}
                onChange={(e) => setFilter(setStatusFilter, e.target.value as ReservationStatusValue | "all")}
                className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary/40">
                <option value="all">All</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </label>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-border/70">
            {isLoadingRes ? (
              <div className="flex items-center justify-center px-6 py-14 text-sm text-muted-foreground">
                <LoaderCircle className="mr-2 size-4 animate-spin" /> Loading…
              </div>
            ) : reservations.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border/70">
                  <thead className="bg-background/80">
                    <tr>
                      {["Guest", "Table", "Date / Time", "Source", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {reservations.map((r) => {
                      const start = new Date(r.startTime);
                      const dateStr = r.reservationDate.slice(0, 10);
                      const timeStr = `${String(start.getUTCHours()).padStart(2,"0")}:${String(start.getUTCMinutes()).padStart(2,"0")}`;
                      const draft = statusDrafts[r.id] ?? r.status;
                      return (
                        <tr key={r.id} className="bg-background/50">
                          <td className="px-4 py-4 align-top">
                            <div className="font-medium text-foreground">{r.customerName}</div>
                            <div className="text-sm text-muted-foreground">{r.phone}</div>
                            <div className="text-xs text-muted-foreground">{r.guestCount} guests</div>
                            {r.note && <div className="text-xs text-muted-foreground">{r.note}</div>}
                          </td>
                          <td className="px-4 py-4 align-top text-sm text-foreground">
                            Table {r.table?.tableNumber ?? "—"}
                          </td>
                          <td className="px-4 py-4 align-top text-sm text-foreground">
                            <div>{dateStr}</div>
                            <div className="text-muted-foreground">{timeStr}</div>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <Badge variant="secondary">{sourceLabels[r.source]}</Badge>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <Badge className={`border ${statusTone[draft]}`}>{draft}</Badge>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <div className="flex flex-wrap items-center gap-2">
                              {r.status === "PENDING" && (
                                <button type="button" onClick={() => handleStatusAction(r, "confirm")}
                                  className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-emerald-300 transition hover:bg-emerald-500/20">
                                  Confirm
                                </button>
                              )}
                              {r.status === "CONFIRMED" && (
                                <button type="button" onClick={() => handleStatusAction(r, "check-in")}
                                  className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-violet-300 transition hover:bg-violet-500/20">
                                  Check-in
                                </button>
                              )}
                              {r.status === "IN_PROGRESS" && (
                                <button type="button" onClick={() => handleStatusAction(r, "complete")}
                                  className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-sky-300 transition hover:bg-sky-500/20">
                                  Complete
                                </button>
                              )}
                              {["PENDING", "CONFIRMED"].includes(r.status) && (
                                <button type="button" onClick={() => handleStatusAction(r, "cancel")}
                                  className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20">
                                  Cancel
                                </button>
                              )}
                              {["PENDING", "CONFIRMED"].includes(r.status) && (
                                <button type="button" onClick={() => handleEdit(r)}
                                  className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-foreground transition hover:border-primary/25">
                                  <Pencil className="size-3.5" />
                                </button>
                              )}
                              {isAdmin && !["COMPLETED", "IN_PROGRESS"].includes(r.status) && (
                                <button type="button" onClick={() => handleDelete(r)}
                                  className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-red-300 transition hover:bg-red-500/20">
                                  <Trash2 className="size-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-14 text-center text-sm text-muted-foreground">
                {filteredTableNum
                  ? `No reservations found for Table ${filteredTableNum}.`
                  : "No reservations match the current filters."}
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                className="rounded-full border border-border/70 bg-background/70 px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition hover:border-primary/25 disabled:opacity-50">
                Prev
              </button>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
                className="rounded-full border border-border/70 bg-background/70 px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition hover:border-primary/25 disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
