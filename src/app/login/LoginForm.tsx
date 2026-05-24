"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LockKeyhole, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  defaultEmail: string;
};

const readErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    return data.message || "Login failed.";
  } catch {
    return "Login failed.";
  }
};

export default function LoginForm({ defaultEmail }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      router.replace("/admin/reservations");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email" className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground/80">
          Admin Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@gusto.local"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 border-primary/15 bg-white/70 font-sans"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground/80">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 border-primary/15 bg-white/70 font-sans"
          required
        />
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 font-sans text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Button type="submit" size="lg" className="h-12 w-full gap-2 bg-primary/95 font-sans" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
        {isSubmitting ? "Signing in..." : "Sign in to admin"}
      </Button>

      <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-4 font-sans text-sm text-muted-foreground">
        <span>Only admin users can access reservations.</span>
        <Link href="/" className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80">
          Back to site
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </form>
  );
}
