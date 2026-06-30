import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import TableManagement from "./TableManagement";

export default async function AdminTablesPage() {
  const cookieStore = await cookies();
  const user = await resolveAuthUser(cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null);

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  return <TableManagement />;
}
