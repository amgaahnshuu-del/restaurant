import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ChefHat, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_COOKIE_NAME, resolveAuthUser } from "@server/auth";
import LoginForm from "./LoginForm";

const devCredentials =
  process.env.NODE_ENV !== "production"
    ? {
        email: process.env.ADMIN_EMAIL || "admin@gusto.local",
        password: process.env.ADMIN_PASSWORD || "ChangeMe123!",
      }
    : null;

export default async function LoginPage() {
  const cookieStore = await cookies();
  const user = await resolveAuthUser(cookieStore.get(AUTH_COOKIE_NAME)?.value);

  if (user?.role === "admin") {
    redirect("/admin/reservations");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ambient-orb left-[-5rem] top-16 h-44 w-44 bg-primary/12" />
        <div className="ambient-orb bottom-12 right-[-4rem] h-56 w-56 bg-primary/10" style={{ animationDelay: "-4s" }} />
        <div className="mesh-overlay opacity-30" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 px-2">
          <div className="section-kicker">Gusto Admin Access</div>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl leading-tight text-foreground md:text-6xl">
              Reservation control with the same <span className="text-gold-gradient">Gusto feel</span>.
            </h1>
            <p className="max-w-xl font-sans text-base leading-7 text-muted-foreground md:text-lg">
              Sign in to review live bookings, confirm operational visibility, and manage the reservation flow without
              touching the public-facing restaurant experience.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="section-shell hover-lift rounded-2xl border border-primary/10 p-5">
              <ShieldCheck className="mb-4 size-6 text-primary" />
              <h2 className="font-display text-2xl text-foreground">Protected admin area</h2>
              <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">
                JWT cookie auth keeps the reservation dashboard behind a signed admin session.
              </p>
            </div>

            <div className="section-shell hover-lift rounded-2xl border border-primary/10 p-5">
              <ChefHat className="mb-4 size-6 text-primary" />
              <h2 className="font-display text-2xl text-foreground">Restaurant-first UI</h2>
              <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">
                The public site stays unchanged while admin tools sit in a dedicated, cleaner route.
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-[0.24em] text-primary/80 transition-colors hover:text-primary"
          >
            Return to restaurant homepage
          </Link>
        </section>

        <Card className="border-primary/12 bg-white/75 shadow-[0_32px_80px_hsl(28_30%_20%/.12)] backdrop-blur-xl">
          <CardHeader className="space-y-3">
            <div className="section-kicker w-fit">Admin Sign In</div>
            <CardTitle className="text-3xl">Welcome back</CardTitle>
            <CardDescription className="font-sans text-sm leading-6 text-muted-foreground">
              Use your seeded admin account to open the reservation dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {devCredentials ? (
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                <p className="font-sans text-xs uppercase tracking-[0.24em] text-primary/80">Development Credentials</p>
                <div className="mt-3 space-y-1 font-sans text-sm text-foreground">
                  <p>
                    <span className="text-muted-foreground">Email:</span> {devCredentials.email}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Password:</span> {devCredentials.password}
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
