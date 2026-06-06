import Link from "next/link";
import { prisma } from "@server/prisma";
import { normalizeReservation } from "@server/reservations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, CheckCircle2, LayoutGrid, ListChecks, Table2, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const [
    totalTables,
    todayReservations,
    pendingReservations,
    confirmedReservations,
    cancelledReservations,
    recentReservations,
  ] = await Promise.all([
    prisma.table.count(),
    prisma.reservation.count({
      where: {
        reservationDate: {
          gte: startOfToday,
          lt: endOfToday,
        },
      },
    }),
    prisma.reservation.count({ where: { status: "pending" } }),
    prisma.reservation.count({ where: { status: "confirmed" } }),
    prisma.reservation.count({ where: { status: "cancelled" } }),
    prisma.reservation.findMany({
      include: {
        table: true,
        user: true,
      },
      orderBy: [{ reservationDate: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
  ]);

  const stats = [
    {
      label: "Total tables",
      value: totalTables,
      icon: Table2,
      description: "All configured dining tables",
    },
    {
      label: "Today's reservations",
      value: todayReservations,
      icon: CalendarClock,
      description: "Reservations scheduled for today",
    },
    {
      label: "Pending",
      value: pendingReservations,
      icon: ListChecks,
      description: "Waiting for confirmation",
    },
    {
      label: "Confirmed",
      value: confirmedReservations,
      icon: CheckCircle2,
      description: "Active reservations",
    },
    {
      label: "Cancelled",
      value: cancelledReservations,
      icon: XCircle,
      description: "Reservations cancelled by staff or guests",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label} className="border-primary/10 bg-white/10 backdrop-blur-xl">
              <CardHeader className="space-y-3 pb-3">
                <CardDescription className="font-sans uppercase tracking-[0.22em]">{stat.label}</CardDescription>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <Icon className="size-6 text-primary" />
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-sans text-xs leading-6 text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-primary/10 bg-white/10 backdrop-blur-xl">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl">Recent reservations</CardTitle>
            <CardDescription className="font-sans text-sm leading-6 text-muted-foreground">
              The latest bookings, sorted by reservation time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReservations.length ? (
              recentReservations.map((reservation) => {
                const record = normalizeReservation({
                  ...reservation,
                  table: reservation.table,
                  user: reservation.user,
                });

                return (
                  <div
                    key={record.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-background/50 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-2">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-primary/70">
                        Table {record.table_number} · {record.source.replace("_", " ")}
                      </div>
                      <div className="text-lg text-foreground">{record.customerName}</div>
                      <div className="font-sans text-sm text-muted-foreground">
                        {formatDateTime(record.reservationDate)} · {record.guestCount} guests
                      </div>
                    </div>
                    <Badge
                      variant={record.status === "confirmed" ? "default" : "secondary"}
                      className="w-fit capitalize"
                    >
                      {record.status}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 px-6 py-12 text-center">
                <p className="text-2xl text-foreground">No reservations yet</p>
                <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">
                  Once guests start booking, they will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-white/10 backdrop-blur-xl">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl">Quick actions</CardTitle>
            <CardDescription className="font-sans text-sm leading-6 text-muted-foreground">
              Jump straight to the management pages when you need to update tables or reservations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/tables"
              className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/50 px-5 py-4 transition hover:border-primary/25 hover:bg-primary/5"
            >
              <div>
                <div className="text-lg text-foreground">Manage tables</div>
                <div className="font-sans text-sm text-muted-foreground">Add, edit, delete, and update table status.</div>
              </div>
              <LayoutGrid className="size-5 text-primary" />
            </Link>
            <Link
              href="/admin/reservations"
              className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/50 px-5 py-4 transition hover:border-primary/25 hover:bg-primary/5"
            >
              <div>
                <div className="text-lg text-foreground">Manage reservations</div>
                <div className="font-sans text-sm text-muted-foreground">Create walk-ins, update statuses, or delete bookings.</div>
              </div>
              <CalendarClock className="size-5 text-primary" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
