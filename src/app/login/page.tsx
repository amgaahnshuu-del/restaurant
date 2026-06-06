import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ChefHat, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import { LANGUAGE_COOKIE_NAME, resolveLanguage } from "@/lib/language";
import LoginForm from "./LoginForm";

const devCredentials =
  process.env.NODE_ENV !== "production"
    ? {
        email: "2",
        password: "1",
      }
    : null;

export default async function LoginPage() {
  const cookieStore = await cookies();
  const user = await resolveAuthUser(cookieStore.get(AUTH_COOKIE_NAME)?.value);
  const language = resolveLanguage(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value);

  if (user?.role === "admin") {
    redirect("/admin/reservations");
  }

  if (user?.role === "customer") {
    redirect("/");
  }

  const copy = {
    en: {
      kicker: "Gusto Admin Access",
      title: "Reservation control with the same Gusto feel.",
      body: "Sign in to review live bookings, confirm operational visibility, and manage the reservation flow without touching the public-facing restaurant experience.",
      protectedTitle: "Protected admin area",
      protectedBody: "JWT cookie auth keeps the reservation dashboard behind a signed admin session.",
      restaurantTitle: "Restaurant-first UI",
      restaurantBody: "The public site stays unchanged while admin tools sit in a dedicated, cleaner route.",
      returnHome: "Return to restaurant homepage",
      signInKicker: "Admin Sign In",
      welcomeBack: "Welcome back",
      signInBody: "Use your seeded admin account to open the reservation dashboard.",
      devCredentials: "Development Credentials",
      email: "Email",
      password: "Password",
    },
    mn: {
      kicker: "Gusto админы нэвтрэлт",
      title: "Ширээний удирдлага Gusto-ийн мэдрэмжээр.",
      body: "Амьд захиалгуудыг шалгаж, үйл ажиллагааны харагдах байдлыг баталгаажуулж, нийтэд харагдах рестораны туршлагад хүрэлгүйгээр захиалгын урсгалыг удирдана уу.",
      protectedTitle: "Хамгаалагдсан админ хэсэг",
      protectedBody: "JWT cookie нэвтрэлт нь захиалгын самбарыг зөвшөөрөгдсөн админ сешний ард хадгална.",
      restaurantTitle: "Рестораны үндсэн UI",
      restaurantBody: "Нийтэд харагдах сайт өөрчлөгдөхгүй, харин админ хэрэгслүүд тусдаа, цэвэрхэн хуудаст байрлана.",
      returnHome: "Рестораны нүүр хуудас руу буцах",
      signInKicker: "Админ нэвтрэлт",
      welcomeBack: "Дахин тавтай морил",
      signInBody: "Захиалгын самбарт орохын тулд бэлэн админ бүртгэлээ ашиглана уу.",
      devCredentials: "Хөгжүүлэлтийн нэвтрэх мэдээлэл",
      email: "Имэйл",
      password: "Нууц үг",
    },
  }[language];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(120deg,hsl(20_16%_8%),hsl(22_14%_10%)_52%,hsl(18_18%_6%))] px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ambient-orb left-[-5rem] top-16 h-44 w-44 bg-primary/12" />
        <div className="ambient-orb bottom-12 right-[-4rem] h-56 w-56 bg-primary/10" style={{ animationDelay: "-4s" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(38_56%_46%/.08)_1px,transparent_1px),linear-gradient(180deg,hsl(38_56%_46%/.06)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
        <div className="mesh-overlay opacity-30" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 px-2">
          <div className="section-kicker">{copy.kicker}</div>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl leading-tight text-foreground md:text-6xl">{copy.title}</h1>
            <p className="max-w-xl font-sans text-base leading-7 text-muted-foreground md:text-lg">{copy.body}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="section-shell hover-lift rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_42px_hsl(0_0%_0%/.24)]">
              <ShieldCheck className="mb-4 size-6 text-primary" />
              <h2 className="font-display text-2xl text-foreground">{copy.protectedTitle}</h2>
              <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">{copy.protectedBody}</p>
            </div>

            <div className="section-shell hover-lift rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_42px_hsl(0_0%_0%/.24)]">
              <ChefHat className="mb-4 size-6 text-primary" />
              <h2 className="font-display text-2xl text-foreground">{copy.restaurantTitle}</h2>
              <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">{copy.restaurantBody}</p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-[0.24em] text-primary/80 transition-colors hover:text-primary"
          >
            {copy.returnHome}
          </Link>
        </section>

        <Card className="border-white/10 bg-[linear-gradient(180deg,hsl(20_15%_12%/.96),hsl(18_16%_9%/.94))] shadow-[0_32px_80px_hsl(0_0%_0%/.42)] backdrop-blur-xl">
          <CardHeader className="space-y-3">
            <div className="section-kicker w-fit">{copy.signInKicker}</div>
            <CardTitle className="text-3xl">{copy.welcomeBack}</CardTitle>
            <CardDescription className="font-sans text-sm leading-6 text-muted-foreground">{copy.signInBody}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {devCredentials ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_hsl(0_0%_100%/.04)]">
                <p className="font-sans text-xs uppercase tracking-[0.24em] text-primary/80">{copy.devCredentials}</p>
                <div className="mt-3 space-y-1 font-sans text-sm text-foreground">
                  <p>
                    <span className="text-muted-foreground">{copy.email}:</span> {devCredentials.email}
                  </p>
                  <p>
                    <span className="text-muted-foreground">{copy.password}:</span> {devCredentials.password}
                  </p>
                </div>
              </div>
            ) : null}

            <LoginForm defaultEmail={devCredentials?.email || ""} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
