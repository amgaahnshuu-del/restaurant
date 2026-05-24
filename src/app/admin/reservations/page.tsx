import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarClock, Phone, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import { prisma } from "@server/prisma";
import { normalizeReservation } from "@server/reservations";
import AdminLogoutButton from "./AdminLogoutButton";

export const dynamic = "force-dynamic";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));

const formatTime = (value: string) => value.slice(0, 5);

export default async function AdminReservationsPage() {
  const cookieStore = await cookies();
  const user = await resolveAuthUser(cookieStore.get(AUTH_COOKIE_NAME)?.value);

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const reservations = (
    await prisma.reservation.findMany({
      orderBy: [{ reservationDate: "asc" }, { reservationTime: "asc" }, { createdAt: "desc" }],
    })
  ).map(normalizeReservation);

  const confirmedCount = reservations.filter((reservation) => reservation.status === "confirmed").length;
  const cancelledCount = reservations.length - confirmedCount;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-8 md:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ambient-orb left-[-4rem] top-24 h-40 w-40 bg-primary/12" />
        <div className="ambient-orb bottom-0 right-[-6rem] h-64 w-64 bg-primary/8" style={{ animationDelay: "-5s" }} />
        <div className="mesh-overlay opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6">
        <section className="section-shell rounded-[2rem] border border-primary/10 px-6 py-8 md:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="section-kicker">Admin Dashboard</div>
              <div className="space-y-3">
                <h1 className="text-4xl leading-tight text-foreground md:text-5xl">Reservation Overview</h1>
                <p className="max-w-2xl font-sans text-sm leading-7 text-muted-foreground md:text-base">
                  Review the latest bookings, keep tabs on cancellations, and keep the dining floor coordinated without
                  changing the public Gusto experience.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 font-sans text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/60 px-3 py-1.5">
                  <ShieldCheck className="size-4 text-primary" />
                  Signed in as {user.name || user.email}
                </span>
                <Link href="/" className="text-primary transition-colors hover:text-primary/80">
                  Open restaurant site
                </Link>
              </div>
            </div>

            <AdminLogoutButton />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-primary/10 bg-white/75 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription className="font-sans uppercase tracking-[0.22em]">Total</CardDescription>
              <CardTitle className="flex items-center gap-3 text-3xl">
                <CalendarClock className="size-6 text-primary" />
                {reservations.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-primary/10 bg-white/75 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription className="font-sans uppercase tracking-[0.22em]">Confirmed</CardDescription>
              <CardTitle className="flex items-center gap-3 text-3xl">
                <Users className="size-6 text-primary" />
                {confirmedCount}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-primary/10 bg-white/75 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription className="font-sans uppercase tracking-[0.22em]">Cancelled</CardDescription>
              <CardTitle className="flex items-center gap-3 text-3xl">
                <Phone className="size-6 text-primary" />
                {cancelledCount}
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        <Card className="border-primary/10 bg-white/80 shadow-[0_24px_70px_hsl(28_30%_20%/.08)] backdrop-blur-sm">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl">All Reservations</CardTitle>
            <CardDescription className="font-sans text-sm leading-6 text-muted-foreground">
              Live data from PostgreSQL, ordered by reservation date and time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reservations.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-sans text-sm font-medium text-foreground">{reservation.customer_name}</div>
                          <div className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Zone {reservation.zone} / Table {reservation.table_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-sans text-sm">{reservation.phone}</TableCell>
                      <TableCell className="font-sans text-sm">{formatDate(reservation.reservation_date)}</TableCell>
                      <TableCell className="font-sans text-sm">
                        {formatTime(reservation.reservation_time)} for {reservation.duration_hours}h
                      </TableCell>
                      <TableCell className="font-sans text-sm">{reservation.table_id}</TableCell>
                      <TableCell className="font-sans text-sm">{reservation.guests || reservation.capacity || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={reservation.status === "confirmed" ? "default" : "secondary"}
                          className="font-sans capitalize"
                        >
                          {reservation.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-12 text-center">
                <p className="font-display text-2xl text-foreground">No reservations yet</p>
                <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">
                  Once guests submit bookings from the public site, they will appear here automatically.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
