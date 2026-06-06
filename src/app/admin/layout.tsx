"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Table2, CalendarCheck, Shield, LogOut, Sparkles } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tables", label: "Tables", icon: Table2 },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="relative min-h-screen overflow-hidden py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-black">
      {/* Premium Dark Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-black to-neutral-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,theme(colors.amber.500/0.03)_1px,transparent_1px),linear-gradient(180deg,theme(colors.amber.500/0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
      </div>

      {/* Animated floating orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-20 left-[-10%] w-72 h-72 rounded-full bg-amber-500/8 blur-3xl"
          style={{ animation: "float-slow 8s ease-in-out infinite" }}
        />
        <div 
          className="absolute bottom-20 right-[-10%] w-80 h-80 rounded-full bg-amber-600/6 blur-3xl"
          style={{ animation: "float-slower 12s ease-in-out infinite", animationDelay: "-3s" }}
        />
        <div 
          className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-amber-400/5 blur-3xl"
          style={{ animation: "float 6s ease-in-out infinite", animationDelay: "-5s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl shadow-2xl"
        >
          {/* Gold top accent bar */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
          
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
                  <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-amber-400 font-semibold">
                    Admin Panel
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight">
                    Restaurant Operations
                    <span className="block text-amber-400 italic mt-1">Dashboard</span>
                  </h1>
                  <p className="max-w-2xl font-sans text-sm sm:text-base text-neutral-400 leading-relaxed">
                    Manage tables, reservations, walk-in entries, and booking statuses from one protected workspace.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-black/30 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-neutral-300 transition-all hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-white"
                >
                  View site
                </Link>
                <AdminLogoutButton />
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="mt-8 flex flex-wrap gap-3 border-t border-amber-500/20 pt-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] transition-all ${
                      isActive
                        ? "border-amber-400 bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/20"
                        : "border-amber-500/30 bg-black/30 text-neutral-300 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </motion.header>

        {/* Children Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            {children}
          </div>
        </motion.div>
      </div>

      {/* Global styles for animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
        }
        .bg-radial-gradient {
          background: radial-gradient(circle at center, transparent 0%, black 100%);
        }
      `}</style>
    </main>
  );
}

// AdminLogoutButton component needs to be created or imported
function AdminLogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/account/login");
      router.refresh();
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-red-400 transition-all hover:bg-red-500/20 hover:border-red-500/50 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <LogOut className="h-3.5 w-3.5" />
      {isPending ? "Signing out..." : "Logout"}
    </button>
  );
}