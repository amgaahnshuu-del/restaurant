"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, UserCheck, LogOut } from "lucide-react";

const navItems = [
  { href: "/staff/reservations", label: "Reservations", icon: CalendarCheck },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="relative min-h-screen overflow-hidden py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-black to-neutral-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/6 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,theme(colors.teal.500/0.03)_1px,transparent_1px),linear-gradient(180deg,theme(colors.teal.500/0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-teal-500/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl shadow-2xl"
        >
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-teal-600 via-teal-400 to-teal-600" />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-teal-400" />
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-teal-400 font-semibold">
                    Staff Panel
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
                    Reservation
                    <span className="block text-teal-400 italic mt-1">Management</span>
                  </h1>
                  <p className="mt-2 font-sans text-sm text-neutral-400">
                    Manage walk-ins, phone bookings, and guest check-ins.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-black/30 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-neutral-300 transition hover:border-teal-500/50 hover:bg-teal-500/10">
                  View site
                </Link>
                <StaffLogoutButton />
              </div>
            </div>

            <nav className="mt-6 flex gap-3 border-t border-teal-500/20 pt-6">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link key={href} href={href}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] transition-all ${
                      isActive
                        ? "border-teal-400 bg-teal-500/20 text-teal-400 shadow-lg shadow-teal-500/20"
                        : "border-teal-500/30 bg-black/30 text-neutral-300 hover:border-teal-500/50 hover:bg-teal-500/10"
                    }`}>
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl sm:rounded-3xl border border-teal-500/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl overflow-hidden">
          <div className="p-6 sm:p-8">{children}</div>
        </motion.div>
      </div>
    </main>
  );
}

function StaffLogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/account/login");
      router.refresh();
      setIsPending(false);
    }
  };

  return (
    <button type="button" onClick={handleLogout} disabled={isPending}
      className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-red-400 transition hover:bg-red-500/20 disabled:opacity-70">
      <LogOut className="h-3.5 w-3.5" />
      {isPending ? "Signing out..." : "Logout"}
    </button>
  );
}
