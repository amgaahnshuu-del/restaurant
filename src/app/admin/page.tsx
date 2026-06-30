import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboard, { type TableWithReservations } from "./AdminDashboard";

export const dynamic = "force-dynamic";

const pad = (n: number) => String(n).padStart(2, "0");
const fmtDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtTime = (d: Date) => `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const user = await resolveAuthUser(cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null);

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);
  const endOfWindow = new Date(startOfToday);
  endOfWindow.setDate(endOfWindow.getDate() + 11);

  const activeStatuses = ["PENDING", "CONFIRMED"] as const;

  const [totalTables, todayReservations, upcomingReservations, tables] = await Promise.all([
    prisma.table.count(),
    prisma.reservation.count({
      where: {
        deletedAt: null,
        reservationDate: { gte: startOfToday, lt: endOfToday },
        status: { in: activeStatuses },
      },
    }),
    prisma.reservation.count({
      where: {
        deletedAt: null,
        reservationDate: { gte: startOfToday, lt: endOfWindow },
        status: { in: activeStatuses },
      },
    }),
    prisma.table.findMany({
      include: {
        reservations: {
          where: {
            deletedAt: null,
            reservationDate: { gte: startOfToday, lt: endOfWindow },
            status: { in: activeStatuses },
          },
          orderBy: { reservationDate: "asc" },
        },
      },
      orderBy: { tableNumber: "asc" },
    }),
  ]);

  const reservedCount = tables.filter((t) => t.reservations.length > 0).length;

  const stats = [
    { label: "Total Tables",        value: totalTables,          description: "All configured dining tables" },
    { label: "Available Tables",    value: totalTables - reservedCount, description: "Tables with no upcoming reservations" },
    { label: "Reserved Tables",     value: reservedCount,        description: "Tables with upcoming confirmed or pending bookings" },
    { label: "Today's Reservations",value: todayReservations,    description: "Bookings scheduled for today" },
    { label: "Upcoming Reservations",value: upcomingReservations,description: "Bookings for the next 10 days" },
  ];

  const tableRecords: TableWithReservations[] = tables.map((table) => ({
    id: table.id,
    tableNumber: table.tableNumber,
    capacity: table.capacity,
    status: table.status,
    createdAt: table.createdAt.toISOString(),
    updatedAt: table.createdAt.toISOString(),
    table_number: table.tableNumber,
    capacity_label: `${table.capacity} guests`,
    created_at: table.createdAt.toISOString(),
    updated_at: table.createdAt.toISOString(),
    upcomingReservations: table.reservations.map((r) => ({
      id: r.id,
      customerName: r.customerName,
      phoneNumber: r.phone,
      phone: r.phone,
      phone_number: r.phone,
      reservationDate: r.reservationDate.toISOString(),
      reservation_date: fmtDate(r.reservationDate),
      reservationTime: fmtTime(r.startTime),
      reservation_time: fmtTime(r.startTime),
      guestCount: r.guestCount,
      guest_count: r.guestCount,
      guests: String(r.guestCount),
      note: r.note ?? null,
      notes: r.note ?? null,
      tableId: r.tableId,
      table_id: r.tableId,
      table_number: table.tableNumber,
      source: r.source,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      created_at: r.createdAt.toISOString(),
      updated_at: r.updatedAt.toISOString(),
      duration_hours: 2,
      capacity: `${table.capacity} guests`,
      zone: "",
      table: null,
      user: null,
    })),
  }));

  return (
    <div className="space-y-6">
      <AdminDashboard tables={tableRecords} stats={stats} />
    </div>
  );
}
