"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LockKeyhole, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateApiMessage } from "@/lib/language";

type LoginFormProps = {
  defaultEmail: string;
};

const readErrorMessage = async (response: Response, language: "en" | "mn") => {
  try {
    const data = await response.json();
    return translateApiMessage(data.message || "Login failed.", language);
  } catch {
    return language === "en" ? "Login failed." : "Нэвтрэхэд алдаа гарлаа.";
  }
};

export default function LoginForm({ defaultEmail }: LoginFormProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = {
    en: {
      email: "Admin ID",
      password: "Password",
      emailPlaceholder: "2",
      passwordPlaceholder: "Enter your password",
      submit: "Sign in to admin",
      submitting: "Signing in...",
      error: "Login failed.",
      note: "Admin and staff access only.",
      back: "Back to site",
    },
    mn: {
      email: "Админ ID",
      password: "Нууц үг",
      emailPlaceholder: "2",
      passwordPlaceholder: "Нууц үгээ оруулна уу",
      submit: "Админаар нэвтрэх",
      submitting: "Нэвтэрч байна...",
      error: "Нэвтрэхэд алдаа гарлаа.",
      note: "Зөвхөн админ болон ажилтнууд нэвтэрнэ.",
      back: "Сайт руу буцах",
    },
  }[language];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

      try {
        const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email || "2",
          password,
          expectedRole: "admin",
        }),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, language));
      }

      const data = (await response.json()) as { redirectTo?: string };
      router.replace(data.redirectTo || "/admin/reservations");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : copy.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email" className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground/80">
          {copy.email}
        </Label>
        <Input
          id="email"
          type="text"
          autoComplete="email"
          placeholder={copy.emailPlaceholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 border-white/10 bg-white/[0.05] font-sans text-foreground placeholder:text-muted-foreground/55 ring-offset-transparent focus-visible:border-primary/35 focus-visible:bg-white/[0.08]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground/80">
          {copy.password}
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder={copy.passwordPlaceholder}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 border-white/10 bg-white/[0.05] font-sans text-foreground placeholder:text-muted-foreground/55 ring-offset-transparent focus-visible:border-primary/35 focus-visible:bg-white/[0.08]"
          required
        />
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 font-sans text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="h-12 w-full gap-2 bg-gold-gradient font-sans text-primary-foreground shadow-[0_18px_34px_hsl(38_56%_46%/.24)]"
        disabled={isSubmitting}
      >
        {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
        {isSubmitting ? copy.submitting : copy.submit}
      </Button>

      <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 font-sans text-sm text-muted-foreground">
        <span>{copy.note}</span>
        <Link href="/" className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80">
          {copy.back}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </form>
  );
}
