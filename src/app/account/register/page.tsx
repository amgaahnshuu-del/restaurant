import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BadgeCheck, CalendarPlus2, UserRoundPlus, Sparkles, ArrowRight, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import { LANGUAGE_COOKIE_NAME, resolveLanguage } from "@/lib/language";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const user = await resolveAuthUser(cookieStore.get(AUTH_COOKIE_NAME)?.value);
  const language = resolveLanguage(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value);

  if (user?.role === "ADMIN") {
    redirect("/admin/reservations");
  }

  if (user?.role === "CUSTOMER") {
    redirect("/");
  }

  const copy = {
    en: {
      kicker: "Create A Guest Account",
      title: "Join Gusto once, then reserve with less friction.",
      body: "Customer accounts keep your contact details handy and give you a single place to review future bookings.",
      bookingsTitle: "Account-linked bookings",
      bookingsBody: "Every new reservation you place while signed in is tied back to your account automatically.",
      repeatTitle: "Built for repeat guests",
      repeatBody: "Your profile stays ready for the next visit without affecting the public restaurant browsing experience.",
      signInLink: "Already registered? Sign in here",
      signUpKicker: "Customer Registration",
      createAccount: "Create your account",
      signUpBody: "Set up your guest profile and head straight into your account after registration.",
      saveLabel: "What you save",
      saveBody: "Name, phone, email, and a secure password. That account can then hold the reservations you create while logged in.",
      benefits: "Member Benefits",
    },
    mn: {
      kicker: "Зочин бүртгэл үүсгэх",
      title: "Gusto-д нэг удаа бүртгүүлээд, илүү хялбар захиалаарай.",
      body: "Хэрэглэгчийн бүртгэл нь таны холбоо барих мэдээллийг бэлэн байлгаж, ирээдүйн захиалгуудаа нэг дороос шалгах боломж олгоно.",
      bookingsTitle: "Бүртгэлтэй холбоотой захиалгууд",
      bookingsBody: "Нэвтэрсэн үед хийсэн шинэ захиалга бүр таны бүртгэлтэй автоматаар холбогдоно.",
      repeatTitle: "Дахин ирдэг зочдод зориулав",
      repeatBody: "Таны профайл дараагийн айлчлалд бэлэн хэвээр байх бөгөөд нийтэд харагдах рестораны хайлтыг өөрчлөхгүй.",
      signInLink: "Аль хэдийн бүртгэлтэй юу? Энд нэвтэрнэ үү",
      signUpKicker: "Хэрэглэгчийн бүртгэл",
      createAccount: "Бүртгэлээ үүсгэх",
      signUpBody: "Зочны профайлаа үүсгээд, бүртгүүлсний дараа шууд бүртгэл рүүгээ орно уу.",
      saveLabel: "Хадгалах мэдээлэл",
      saveBody: "Нэр, утас, имэйл, аюулгүй нууц үг. Дараа нь энэ бүртгэлээр нэвтэрсэн үед хийсэн захиалгууд хадгалагдана.",
      benefits: "Хэрэглэгчийн давуу тал",
    },
  }[language];

  return (
    <main className="relative min-h-screen overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
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

      <div className="relative z-10 mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        <div className="w-full max-w-7xl grid gap-8 lg:gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Left Content */}
          <section className="space-y-5 sm:space-y-6 md:space-y-8 px-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/20 bg-white/90 dark:bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm w-fit">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
              <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                {copy.kicker}
              </span>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-[1.15] sm:leading-[1.1] md:leading-[1.05] tracking-tight max-w-xl">
                {copy.title}
              </h1>
              <p className="max-w-xl font-sans text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {copy.body}
              </p>
            </div>

            {/* Benefits Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="group rounded-xl sm:rounded-2xl border-2 border-amber-600/20 dark:border-amber-500/20 bg-white/90 dark:bg-black/40 p-4 sm:p-5 backdrop-blur-md shadow-lg hover:border-amber-600/40 dark:hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CalendarPlus2 className="mb-2 h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                <h2 className="font-display text-lg sm:text-xl md:text-2xl text-neutral-800 dark:text-neutral-100 mb-1 sm:mb-2">
                  {copy.bookingsTitle}
                </h2>
                <p className="font-sans text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {copy.bookingsBody}
                </p>
              </div>

              <div className="group rounded-xl sm:rounded-2xl border-2 border-amber-600/20 dark:border-amber-500/20 bg-white/90 dark:bg-black/40 p-4 sm:p-5 backdrop-blur-md shadow-lg hover:border-amber-600/40 dark:hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <BadgeCheck className="mb-2 h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                <h2 className="font-display text-lg sm:text-xl md:text-2xl text-neutral-800 dark:text-neutral-100 mb-1 sm:mb-2">
                  {copy.repeatTitle}
                </h2>
                <p className="font-sans text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {copy.repeatBody}
                </p>
              </div>
            </div>

            <Link
              href="/account/login"
              className="group inline-flex items-center gap-2 font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 transition-all duration-300 hover:gap-3"
            >
              {copy.signInLink}
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </section>

          {/* Register Card */}
          <Card className="border-2 border-amber-600/20 dark:border-amber-500/20 bg-white/95 dark:bg-black/60 backdrop-blur-xl shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardHeader className="space-y-2 sm:space-y-3 pb-4 sm:pb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/20 bg-white/90 dark:bg-white/10 px-3 py-1.5 backdrop-blur-sm w-fit">
                <UserRoundPlus className="h-3 w-3 text-amber-600" />
                <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                  {copy.signUpKicker}
                </span>
              </div>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-light text-neutral-800 dark:text-neutral-100">
                {copy.createAccount}
              </CardTitle>
              <CardDescription className="font-sans text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {copy.signUpBody}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Info Box */}
              <div className="rounded-xl border-2 border-amber-600/20 bg-amber-50/50 dark:bg-amber-950/20 p-3 sm:p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.24em] text-amber-700 dark:text-amber-400">
                  <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {copy.saveLabel}
                </div>
                <p className="mt-1.5 sm:mt-2 font-sans text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {copy.saveBody}
                </p>
              </div>

              <RegisterForm />
              
              {/* Member Benefits */}
              <div className="pt-2 sm:pt-4 text-center">
                <p className="font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-500 mb-2">
                  {copy.benefits}
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-[8px] sm:text-[9px] md:text-[10px] text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <span className="text-amber-600">✓</span> Priority Booking
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-amber-600">✓</span> Special Offers
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-amber-600">✓</span> Points Rewards
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-amber-600">✓</span> Easy Reservations
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}