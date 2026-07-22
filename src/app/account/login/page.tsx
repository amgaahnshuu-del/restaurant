import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarCheck2, Sparkles, UserRound, ArrowRight, Heart, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import { LANGUAGE_COOKIE_NAME, resolveLanguage } from "@/lib/language";
import CustomerLoginForm from "./CustomerLoginForm";

const devCredentials =
  process.env.NODE_ENV !== "production"
    ? {
        email: process.env.CUSTOMER_EMAIL || "guest@gusto.local",
        password: process.env.CUSTOMER_PASSWORD || "GuestPass123!",
      }
    : null;

export default async function CustomerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const cookieStore = await cookies();
  const user = await resolveAuthUser(cookieStore.get(AUTH_COOKIE_NAME)?.value);
  const language = resolveLanguage(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value);

  // Only allow same-site relative redirects (avoids open-redirect).
  const { redirect: redirectParam } = await searchParams;
  const safeRedirect =
    redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : undefined;

  if (user?.role === "ADMIN") {
    redirect("/admin/reservations");
  }

  if (user?.role === "CUSTOMER") {
    redirect(safeRedirect || "/");
  }

  const copy = {
    en: {
      kicker: "Guest Account Access",
      title: "Your next reservation, stored in one Gusto account.",
      body: "Sign in to keep your profile ready for future bookings and review the reservations you make while logged in.",
      bookingsTitle: "Track your bookings",
      bookingsBody: "New reservations made while signed in appear inside your personal account page automatically.",
      fasterTitle: "Faster repeat visits",
      fasterBody: "Save your details once, then come back any time without starting from scratch.",
      registerLink: "Need an account? Register here",
      signInKicker: "Customer Sign In",
      welcomeBack: "Welcome back",
      signInBody: "Use your customer account to continue to your Gusto account page.",
      email: "Email",
      password: "Password",
      signIn: "Sign In",
      or: "or",
      continueAsGuest: "Continue as Guest",
      benefits: "Member Benefits",
    },
    mn: {
      kicker: "Зочин бүртгэлийн нэвтрэлт",
      title: "Таны дараагийн захиалга нэг Gusto бүртгэлд хадгалагдана.",
      body: "Ирээдүйн захиалгад профайлаа бэлэн байлгаж, нэвтэрсэн үед хийсэн захиалгуудыг шалгана уу.",
      bookingsTitle: "Захиалгаа хянах",
      bookingsBody: "Нэвтэрсэн үед хийсэн шинэ захиалгууд таны хувийн бүртгэлийн хуудсанд автоматаар гарч ирнэ.",
      fasterTitle: "Дахин ирэхэд хурдан",
      fasterBody: "Мэдээллээ нэг удаа хадгалаад, дараа нь эхнээс нь бөглөхгүйгээр буцаж орж болно.",
      registerLink: "Бүртгэлгүй юу? Энд бүртгүүлнэ үү",
      signInKicker: "Хэрэглэгчийн нэвтрэлт",
      welcomeBack: "Дахин тавтай морил",
      signInBody: "Gusto бүртгэлийн хуудсаа үргэлжлүүлэхийн тулд хэрэглэгчийн бүртгэлээ ашиглана уу.",
      email: "Имэйл",
      password: "Нууц үг",
      signIn: "Нэвтрэх",
      or: "эсвэл",
      continueAsGuest: "Зочноор үргэлжлүүлэх",
      benefits: "Хэрэглэгчийн давуу тал",
    },
  }[language];

  return (
    <main className="relative min-h-screen overflow-hidden py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      {/* Background with Gusto styling */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-white/40 to-amber-100/30 dark:from-neutral-950/90 dark:via-neutral-900/95 dark:to-neutral-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,theme(colors.amber.500/0.12),transparent_55%)] dark:bg-[radial-gradient(circle_at_top_left,theme(colors.amber.600/0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,theme(colors.amber.600/0.08)_1px,transparent_1px),linear-gradient(180deg,theme(colors.amber.600/0.06)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>
      
      {/* Animated orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-5rem] top-16 h-44 w-44 rounded-full bg-amber-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-12 right-[-4rem] h-56 w-56 rounded-full bg-amber-600/15 blur-3xl animate-pulse" style={{ animationDelay: "-2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-8 lg:gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Content */}
        <section className="space-y-6 sm:space-y-8 px-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/20 bg-white/90 dark:bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm w-fit">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
            <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              {copy.kicker}
            </span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] sm:leading-[1.05] md:leading-[0.95] tracking-tight max-w-xl">
              {copy.title}
            </h1>
            <p className="max-w-xl font-sans text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
              {copy.body}
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
            <div className="group rounded-xl sm:rounded-2xl border-2 border-amber-600/20 dark:border-amber-500/20 bg-white/90 dark:bg-black/40 p-5 backdrop-blur-md shadow-lg hover:border-amber-600/40 dark:hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CalendarCheck2 className="mb-3 h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              <h2 className="font-display text-xl sm:text-2xl text-neutral-800 dark:text-neutral-100 mb-2">
                {copy.bookingsTitle}
              </h2>
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {copy.bookingsBody}
              </p>
            </div>

            <div className="group rounded-xl sm:rounded-2xl border-2 border-amber-600/20 dark:border-amber-500/20 bg-white/90 dark:bg-black/40 p-5 backdrop-blur-md shadow-lg hover:border-amber-600/40 dark:hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Sparkles className="mb-3 h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              <h2 className="font-display text-xl sm:text-2xl text-neutral-800 dark:text-neutral-100 mb-2">
                {copy.fasterTitle}
              </h2>
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {copy.fasterBody}
              </p>
            </div>
          </div>

          <Link
            href="/account/register"
            className="group inline-flex items-center gap-2 font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 transition-all duration-300 hover:gap-3"
          >
            {copy.registerLink}
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </section>

        {/* Login Card */}
        <Card className="border-2 border-amber-600/20 dark:border-amber-500/20 bg-white/95 dark:bg-black/60 backdrop-blur-xl shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardHeader className="space-y-3 pb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/20 bg-white/90 dark:bg-white/10 px-3 py-1.5 backdrop-blur-sm w-fit">
              <UserRound className="h-3 w-3 text-amber-600" />
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                {copy.signInKicker}
              </span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-light text-neutral-800 dark:text-neutral-100">
              {copy.welcomeBack}
            </CardTitle>
            <CardDescription className="font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {copy.signInBody}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <CustomerLoginForm defaultEmail="" redirectTo={safeRedirect} />
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-600/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/95 dark:bg-black/60 px-4 text-neutral-500 dark:text-neutral-500 font-sans tracking-[0.2em]">
                  {copy.or}
                </span>
              </div>
            </div>
            
            {/* Guest Button */}
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-amber-600/30 bg-white/80 dark:bg-white/10 px-6 py-3 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-amber-700 dark:text-amber-400 transition-all duration-300 hover:bg-amber-600 hover:text-white hover:border-amber-600"
            >
              <Heart className="h-3.5 w-3.5" />
              {copy.continueAsGuest}
            </Link>
            
            {/* Member Benefits */}
            <div className="pt-4 text-center">
              <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-500 mb-2">
                {copy.benefits}
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <span className="text-amber-600">✓</span> Priority Booking
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-amber-600">✓</span> Special Offers
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-amber-600">✓</span> Points Rewards
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}