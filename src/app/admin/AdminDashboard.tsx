"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, ChevronRight, Clock3, LayoutDashboard, ListChecks, Search, Shield, Table2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ApiReservation, ApiTable } from "@server/reservations";

export type TableWithReservations = ApiTable & {
  upcomingReservations: ApiReservation[];
};

interface DashboardStat {
  label: string;
  value: number;
  description: string;
}

interface AdminDashboardProps {
  tables: TableWithReservations[];
  stats: DashboardStat[];
}

const statusStyle: Record<string, string> = {
  PENDING:     "bg-amber-500/10 text-amber-200 border border-amber-500/20",
  CONFIRMED:   "bg-emerald-500/10 text-emerald-200 border border-emerald-500/20",
  CANCELLED:   "bg-red-500/10 text-red-200 border border-red-500/20",
  COMPLETED:   "bg-sky-500/10 text-sky-200 border border-sky-500/20",
  IN_PROGRESS: "bg-violet-500/10 text-violet-200 border border-violet-500/20",
};

export default function AdminDashboard({ tables, stats }: AdminDashboardProps) {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(tables[0]?.id ?? null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const selectedTable = useMemo(
    () => tables.find((table) => table.id === selectedTableId) ?? tables[0] ?? null,
    [tables, selectedTableId],
  );

  const allReservations = useMemo(
    () => tables.flatMap((table) => table.upcomingReservations.map((reservation) => ({ ...reservation, table }))),
    [tables],
  );

  const filteredReservations = useMemo(() => {
    return allReservations.filter((reservation) => {
      const matchesSearch = searchTerm
        ? [reservation.customerName, reservation.phoneNumber].some((value) =>
            value.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : true;

      const matchesDate = dateFilter ? reservation.reservation_date === dateFilter : true;
      const matchesStatus = statusFilter === "all" ? true : reservation.status === statusFilter;
      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [allReservations, dateFilter, searchTerm, statusFilter]);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[1.75rem] border border-primary/10 bg-white/10 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-primary">
              {stat.label === "Total Tables" ? <Table2 className="size-5" /> : null}
              {stat.label === "Available Tables" ? <Shield className="size-5" /> : null}
              {stat.label === "Reserved Tables" ? <LayoutDashboard className="size-5" /> : null}
              {stat.label === "Today's Reservations" ? <CalendarDays className="size-5" /> : null}
              {stat.label === "Upcoming Reservations" ? <Clock3 className="size-5" /> : null}
              <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{stat.label}</span>
            </div>
            <div className="mt-4 text-4xl font-semibold text-foreground">{stat.value}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{stat.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-primary/10 bg-white/10 p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-primary/70">Reservation filters</p>
                <h2 className="mt-2 text-3xl font-semibold text-foreground">Search reservations</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/admin/reservations" className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm text-foreground transition hover:border-primary/30 hover:bg-primary/5">
                  Manage reservations
                  <ChevronRight className="size-4" />
                </Link>
                <Link href="/admin/tables" className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm text-foreground transition hover:border-primary/30 hover:bg-primary/5">
                  Manage tables
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Search</span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-2xl border border-border/70 bg-background/70 py-3 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary/40"
                    placeholder="Customer name or phone"
                  />
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Date</span>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/40"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/40"
                >
                  <option value="all">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-[2rem] border border-primary/10 bg-white/10 p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-primary/70">Tables overview</p>
                <h3 className="mt-2 text-2xl font-semibold text-foreground">All restaurant tables</h3>
              </div>
              <span className="text-sm text-muted-foreground">{tables.length} tables</span>
            </div>

            <div className="space-y-4">
              {tables.length ? (
                tables.map((table) => {
                  const isActive = selectedTable?.id === table.id;
                  const upcoming = table.upcomingReservations.length;

                  return (
                    <button
                      key={table.id}
                      type="button"
                      onClick={() => setSelectedTableId(table.id)}
                      className={`w-full rounded-3xl border p-5 text-left transition ${
                        isActive ? "border-primary bg-primary/10" : "border-border/60 bg-background/70 hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold text-foreground">Table {table.tableNumber}</div>
                          <div className="mt-1 text-sm text-muted-foreground">Capacity: {table.capacity}</div>
                        </div>
                        <Badge className={table.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-200 border border-emerald-500/20" : table.status === "RESERVED" ? "bg-amber-500/10 text-amber-200 border border-amber-500/20" : "bg-slate-500/10 text-slate-200 border border-slate-500/20"}>
                          {table.status}
                        </Badge>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="text-sm text-muted-foreground">Upcoming reservations</div>
                        <div className="rounded-full bg-background/80 px-3 py-1 text-sm text-foreground">{upcoming} entries</div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-dashed border-border/70 bg-background/70 p-8 text-center text-sm text-muted-foreground">
                  No tables found.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-primary/10 bg-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-primary/70">Table details</p>
                <h3 className="mt-2 text-3xl font-semibold text-foreground">
                  {selectedTable ? `Table ${selectedTable.tableNumber}` : "Select a table"}
                </h3>
              </div>
              <span className="text-sm text-muted-foreground">Capacity {selectedTable?.capacity ?? "—"}</span>
            </div>

            {selectedTable ? (
              <div className="mt-6 space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
                    <div className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Current availability</div>
                    <div className="mt-3 text-lg font-semibold text-foreground">
                      {selectedTable.upcomingReservations.length ? "Reserved soon" : "Available now"}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
                    <div className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Upcoming slots</div>
                    <div className="mt-3 text-lg font-semibold text-foreground">{selectedTable.upcomingReservations.length}</div>
                  </div>
                </div>

                {selectedTable.upcomingReservations.length ? (
                  <div className="space-y-3">
                    <div className="text-sm uppercase tracking-[0.24em] text-primary/70">Upcoming reservations</div>
                    <div className="space-y-3">
                      {selectedTable.upcomingReservations.map((reservation) => (
                        <div key={reservation.id} className="rounded-3xl border border-border/70 bg-background/80 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <div className="font-semibold text-foreground">{reservation.customerName}</div>
                              <div className="text-sm text-muted-foreground">{reservation.phoneNumber}</div>
                            </div>
                            <Badge className={statusStyle[reservation.status] ?? "bg-slate-500/10 text-slate-200 border border-slate-500/20"}>
                              {reservation.status}
                            </Badge>
                          </div>
                          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            <div>
                              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Date</div>
                              <div className="mt-1 text-sm text-foreground">{reservation.reservation_date}</div>
                            </div>
                            <div>
                              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Time</div>
                              <div className="mt-1 text-sm text-foreground">{reservation.reservation_time}</div>
                            </div>
                            <div>
                              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Guests</div>
                              <div className="mt-1 text-sm text-foreground">{reservation.guestCount}</div>
                            </div>
                          </div>
                          {reservation.notes ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{reservation.notes}</p> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-border/70 bg-background/80 p-8 text-center text-sm text-muted-foreground">
                    No upcoming reservations for this table.
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border/70 bg-background/80 p-10 text-center text-sm text-muted-foreground">
                Select a table from the list to inspect its upcoming bookings.
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-primary/10 bg-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-primary/70">Matched reservations</p>
                <h3 className="mt-2 text-2xl font-semibold text-foreground">Search results</h3>
              </div>
              <span className="text-sm text-muted-foreground">{filteredReservations.length} results</span>
            </div>

            {filteredReservations.length ? (
              <div className="mt-6 space-y-4">
                {filteredReservations.map((reservation) => (
                  <div key={reservation.id} className="rounded-3xl border border-border/70 bg-background/80 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-foreground">{reservation.customerName}</div>
                        <div className="text-sm text-muted-foreground">{reservation.phoneNumber}</div>
                      </div>
                      <div className="rounded-full bg-background/90 px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        Table {reservation.table_number}
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Date</div>
                        <div className="mt-1 text-sm text-foreground">{reservation.reservation_date}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Time</div>
                        <div className="mt-1 text-sm text-foreground">{reservation.reservation_time}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Guests</div>
                        <div className="mt-1 text-sm text-foreground">{reservation.guestCount}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <Badge className={statusStyle[reservation.status] ?? "bg-slate-500/10 text-slate-200 border border-slate-500/20"}>
                        {reservation.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground">{reservation.source}</div>
                    </div>
                    {reservation.notes ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{reservation.notes}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-dashed border-border/70 bg-background/80 p-8 text-center text-sm text-muted-foreground">
                No reservations match the current filters.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
