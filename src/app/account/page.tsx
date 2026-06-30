import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Bell, CalendarCheck2, Clock3, Languages, Lock, Settings2, UserRound, Sparkles, Star, Phone, Users, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LanguageToggle from "@/components/LanguageToggle";
import { LANGUAGE_COOKIE_NAME, resolveLanguage } from "@/lib/language";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import { prisma } from "@server/prisma";
import { normalizeReservation } from "@server/reservations";
import AccountLogoutButton from "./AccountLogoutButton";

export const dynamic = "force-dynamic";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));

const formatTime = (value: string) => value.slice(0, 5);

export default async function AccountPage() {
  const cookieStore = await cookies();
  const user = await resolveAuthUser(cookieStore.get(AUTH_COOKIE_NAME)?.value);
  const language = resolveLanguage(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value);

  if (!user) {
    redirect("/account/login");
  }

  if (user.role === "ADMIN") {
    redirect("/admin/reservations");
  }

  if (user.role === "STAFF") {
    redirect("/staff/reservations");
  }

  const reservations = (
    await prisma.reservation.findMany({
      where: {
        userId: user.id,
      },
      include: {
        table: true,
        user: true,
      },
      orderBy: [{ reservationDate: "asc" }, { createdAt: "desc" }],
    })
  ).map(normalizeReservation);

  const now = new Date();
  const upcomingCount = reservations.filter((reservation) => {
    const reservationStart = new Date(`${reservation.reservation_date}T${reservation.reservation_time}`);
    return reservation.status === "confirmed" && reservationStart >= now;
  }).length;
  const confirmedCount = reservations.filter((reservation) => reservation.status === "confirmed").length;
  
  const copy = {
    en: {
      profileTitle: "User information",
      profileDescription: "Your account details are attached to every reservation you make while signed in.",
      profileDetails: [
        { label: "Full name", value: user.name || "Guest User" },
        { label: "Email address", value: user.email },
        { label: "Phone number", value: user.phone || "Not set" },
        { label: "Account role", value: user.role === "customer" ? "Customer" : "Admin" },
      ],
      settingsTitle: "Account settings",
      settingsDescription: "A quick view of the guest preferences active on this account.",
      settings: [
        {
          label: "Reservation sync",
          value: "Enabled",
          description: "Confirmed bookings made while signed in stay linked to this account.",
          icon: CalendarCheck2,
        },
        {
          label: "Notifications",
          value: "On",
          description: "Booking updates and follow-up messages are ready to be delivered.",
          icon: Bell,
        },
        {
          label: "Security",
          value: "Session active",
          description: "You are signed in with a secure server-side session token.",
          icon: Lock,
        },
      ],
      languageTitle: "Language preference",
      languageDescription: "Choose the language used across the restaurant experience.",
      reserveTable: "Reserve a table",
      totalBookings: "Total bookings",
      upcoming: "Upcoming",
      confirmed: "Confirmed",
      reservationsTitle: "Your reservations",
      reservationsDescription: "Reservations made while you are signed in will stay attached to this account.",
      emptyTitle: "No account-linked reservations yet",
      emptyDescription: "Your future reservations will appear here once you book while signed in.",
      tableInZone: (tableNumber: number, zone: string) => `Table ${tableNumber} in zone ${zone}`,
      phoneLabel: "Phone",
      guestsLabel: "Guests",
      statusLabels: {
        confirmed: "Confirmed",
        cancelled: "Cancelled",
      },
      durationSuffix: (hours: number) => `${hours} hour${hours > 1 ? "s" : ""}`,
      welcomeBack: "Welcome back,",
    },
    mn: {
      profileTitle: "Хэрэглэгчийн мэдээлэл",
      profileDescription: "Таны бүртгэлийн мэдээлэл нэвтэрсэн үед хийсэн бүх захиалгад холбогдоно.",
      profileDetails: [
        { label: "Бүтэн нэр", value: user.name || "Зочин хэрэглэгч" },
        { label: "Имэйл хаяг", value: user.email },
        { label: "Утасны дугаар", value: user.phone || "Оруулаагүй" },
        { label: "Бүртгэлийн төрөл", value: user.role === "customer" ? "Хэрэглэгч" : "Админ" },
      ],
      settingsTitle: "Бүртгэлийн тохиргоо",
      settingsDescription: "Энэ бүртгэл дээр идэвхтэй байгаа зочны тохиргооны товч тойм.",
      settings: [
        {
          label: "Захиалгын синк",
          value: "Идэвхтэй",
          description: "Нэвтэрсэн үед хийсэн баталгаажсан захиалгууд энэ бүртгэлд холбогдсон хэвээр байна.",
          icon: CalendarCheck2,
        },
        {
          label: "Мэдэгдэл",
          value: "Асаалттай",
          description: "Захиалгын шинэчлэл болон дараах мэдэгдлүүд илгээхэд бэлэн байна.",
          icon: Bell,
        },
        {
          label: "Аюулгүй байдал",
          value: "Сешн идэвхтэй",
          description: "Та сервер талын хамгаалалттай сешнээр нэвтэрсэн байна.",
          icon: Lock,
        },
      ],
      languageTitle: "Хэлний сонголт",
      languageDescription: "Рестораны туршлагад ашиглах хэлийг сонгоно уу.",
      reserveTable: "Ширээ захиалах",
      totalBookings: "Нийт захиалга",
      upcoming: "Ирэх",
      confirmed: "Баталгаажсан",
      reservationsTitle: "Таны захиалгууд",
      reservationsDescription: "Та нэвтэрсэн үед хийсэн захиалгууд энэ бүртгэлд хадгалагдана.",
      emptyTitle: "Бүртгэлтэй холбоотой захиалга алга байна",
      emptyDescription: "Нэвтэрсэн үедээ хийсэн ирээдүйн захиалгууд энд гарч ирнэ.",
      tableInZone: (tableNumber: number, zone: string) => `${zone} бүсийн ${tableNumber}-р ширээ`,
      phoneLabel: "Утас",
      guestsLabel: "Зочин",
      statusLabels: {
        confirmed: "Баталгаажсан",
        cancelled: "Цуцлагдсан",
      },
      durationSuffix: (hours: number) => `${hours} цаг`,
      welcomeBack: "Тавтай морилно уу,",
    },
  }[language];

  return (
    <main className="relative min-h-screen overflow-hidden py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-black">
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
        <div className="absolute top-20 left-[-10%] w-72 h-72 rounded-full bg-amber-500/8 blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-[-10%] w-80 h-80 rounded-full bg-amber-600/6 blur-3xl animate-float-slower" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-amber-400/5 blur-3xl animate-float" style={{ animationDelay: "-5s" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 mb-4">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
            <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-amber-400">
              My Account
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white">
            {copy.welcomeBack}
            <span className="block text-amber-400 italic mt-1">{user.name?.split(" ")[0] || "Guest"}</span>
          </h1>
        </div>

        {/* Profile and Settings Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Card */}
          <div className="rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-amber-500/40">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-full bg-amber-500/10 p-3 border border-amber-500/30">
                  <UserRound className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-light text-white">{copy.profileTitle}</h2>
                  <p className="text-sm text-neutral-400 mt-1">{copy.profileDescription}</p>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {copy.profileDetails.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-amber-500/20 bg-black/30 p-4 transition-all duration-300 hover:border-amber-500/40"
                  >
                    <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-amber-400">{item.label}</div>
                    <div className="mt-1 font-sans text-sm sm:text-base text-white/90">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-amber-500/40">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-full bg-amber-500/10 p-3 border border-amber-500/30">
                  <Settings2 className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-light text-white">{copy.settingsTitle}</h2>
                  <p className="text-sm text-neutral-400 mt-1">{copy.settingsDescription}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {copy.settings.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-amber-500/20 bg-black/30 p-4 transition-all duration-300 hover:border-amber-500/40"
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-amber-400" />
                            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-amber-400">{item.label}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-neutral-400">{item.description}</p>
                        </div>
                        <Badge className="border border-amber-500/30 bg-amber-500/10 text-amber-400 rounded-full px-3 py-1">
                          {item.value}
                        </Badge>
                      </div>
                    </div>
                  );
                })}

                {/* Language Settings */}
                <div className="rounded-xl border border-amber-500/20 bg-black/30 p-4 transition-all duration-300 hover:border-amber-500/40">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Languages className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-amber-400">{copy.languageTitle}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-400">{copy.languageDescription}</p>
                    </div>
                    <div className="shrink-0">
                      <LanguageToggle />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <Link
                    href="/reservation"
                    className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-white transition-all hover:bg-amber-500 hover:shadow-lg"
                  >
                    <CalendarCheck2 className="h-3.5 w-3.5" />
                    {copy.reserveTable}
                  </Link>
                  <AccountLogoutButton />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl p-6 text-center transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-400">{copy.totalBookings}</p>
            <p className="text-4xl sm:text-5xl font-light text-white mt-2">{reservations.length}</p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl p-6 text-center transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-400">{copy.upcoming}</p>
            <p className="text-4xl sm:text-5xl font-light text-white mt-2">{upcomingCount}</p>
            <Clock3 className="h-4 w-4 text-amber-400 mx-auto mt-2" />
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl p-6 text-center transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-400">{copy.confirmed}</p>
            <p className="text-4xl sm:text-5xl font-light text-white mt-2">{confirmedCount}</p>
            <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto mt-2" />
          </div>
        </div>

        {/* Reservations List */}
        <div className="rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-amber-500/40">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-full bg-amber-500/10 p-2 border border-amber-500/30">
                <CalendarCheck2 className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-light text-white">{copy.reservationsTitle}</h2>
                <p className="text-sm text-neutral-400 mt-1">{copy.reservationsDescription}</p>
              </div>
            </div>

            <div className="space-y-4">
              {reservations.length ? (
                reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="rounded-xl border border-amber-500/20 bg-black/30 p-5 transition-all duration-300 hover:border-amber-500/40 hover:bg-black/40"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3 w-3 text-amber-400" />
                          <span className="text-[10px] uppercase tracking-[0.24em] text-amber-400">
                            {copy.tableInZone(reservation.table_number, reservation.zone)}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl text-white">{reservation.customer_name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" />
                            {formatDate(reservation.reservation_date)} at {formatTime(reservation.reservation_time)}
                          </span>
                          <span>•</span>
                          <span>{copy.durationSuffix(reservation.duration_hours)}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {reservation.phone}
                          </span>
                          {reservation.guests && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {reservation.guests} {copy.guestsLabel}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <Badge
                        className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${
                          reservation.status === "confirmed"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                      >
                        {copy.statusLabels[reservation.status as keyof typeof copy.statusLabels]}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-amber-500/20 bg-black/30 px-6 py-12 text-center">
                  <Sparkles className="h-8 w-8 text-amber-400 mx-auto mb-3 opacity-50" />
                  <p className="text-lg text-white">{copy.emptyTitle}</p>
                  <p className="mt-1 text-sm text-neutral-400">{copy.emptyDescription}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 12s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .bg-radial-gradient {
          background: radial-gradient(circle at center, transparent 0%, black 100%);
        }
      `}</style>
    </main>
  );
}