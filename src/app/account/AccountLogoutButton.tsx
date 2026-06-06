"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AccountLogoutButton() {
  const { language } = useLanguage();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const copy = {
    en: { signingOut: "Signing out...", logout: "Logout" },
    mn: { signingOut: "Гарч байна...", logout: "Гарах" },
  }[language];

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
    <Button
      type="button"
      variant="outline"
      className="gap-2 border-white/10 bg-white/[0.045] font-sans text-foreground hover:bg-white/10 hover:text-foreground"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      {isPending ? copy.signingOut : copy.logout}
    </Button>
  );
}
