import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import ReservationManagement from "@/app/admin/reservations/ReservationManagement";

export default async function StaffReservationsPage() {
  const cookieStore = await cookies();
  const user = await resolveAuthUser(cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null);

  if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
    redirect("/login");
  }

  return <ReservationManagement isAdmin={false} />;
}
