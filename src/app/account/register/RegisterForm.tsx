"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LoaderCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateApiMessage } from "@/lib/language";

const readErrorMessage = async (response: Response, language: "en" | "mn") => {
  try {
    const data = await response.json();
    return translateApiMessage(data.message || "Could not create your account.", language);
  } catch {
    return language === "en" ? "Could not create your account." : "Бүртгэл үүсгэж чадсангүй.";
  }
};

export default function RegisterForm() {
  const { language } = useLanguage();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = {
    en: {
      name: "Full name",
      phone: "Phone",
      email: "Email",
      password: "Password",
      namePlaceholder: "Your full name",
      phonePlaceholder: "+976 99112233",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "Choose a password",
      submit: "Create customer account",
      submitting: "Creating account...",
      error: "Could not create your account.",
      prompt: "Already have an account?",
      signIn: "Sign in instead",
      back: "Back to site",
    },
    mn: {
      name: "Бүтэн нэр",
      phone: "Утас",
      email: "Имэйл",
      password: "Нууц үг",
      namePlaceholder: "Таны бүтэн нэр",
      phonePlaceholder: "+976 99112233",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "Нууц үг сонгоно уу",
      submit: "Хэрэглэгчийн бүртгэл үүсгэх",
      submitting: "Бүртгэл үүсгэж байна...",
      error: "Бүртгэл үүсгэж чадсангүй.",
      prompt: "Та аль хэдийн бүртгэлтэй юу?",
      signIn: "Нэвтрэх",
      back: "Сайт руу буцах",
    },
  }[language];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

      try {
        const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, language));
      }

      const data = (await response.json()) as { redirectTo?: string };
      router.replace(data.redirectTo || "/");
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
        <Label htmlFor="name" className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground/80">
          {copy.name}
        </Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder={copy.namePlaceholder}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-12 border-white/10 bg-white/[0.05] font-sans text-foreground placeholder:text-muted-foreground/55 ring-offset-transparent focus-visible:border-primary/35 focus-visible:bg-white/[0.08]"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone" className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground/80">
            {copy.phone}
          </Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder={copy.phonePlaceholder}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="h-12 border-white/10 bg-white/[0.05] font-sans text-foreground placeholder:text-muted-foreground/55 ring-offset-transparent focus-visible:border-primary/35 focus-visible:bg-white/[0.08]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground/80">
            {copy.email}
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 border-white/10 bg-white/[0.05] font-sans text-foreground placeholder:text-muted-foreground/55 ring-offset-transparent focus-visible:border-primary/35 focus-visible:bg-white/[0.08]"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground/80">
          {copy.password}
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
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
        {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
        {isSubmitting ? copy.submitting : copy.submit}
      </Button>

      <div className="space-y-3 border-t border-white/10 pt-4 font-sans text-sm text-muted-foreground">
        <p>{copy.prompt}</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/account/login" className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80">
            {copy.signIn}
            <ArrowRight className="size-4" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80">
            {copy.back}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </form>
  );
}
