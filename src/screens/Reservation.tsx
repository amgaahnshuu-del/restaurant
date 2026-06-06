"use client";

import Link from "next/link";
import FooterSection from "@/components/FooterSection";
import ReservationSection from "@/components/ReservationSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Reservation = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      back: "Back to home",
      menu: "View menu",
    },
    mn: {
      back: "Нүүр хуудас руу буцах",
      menu: "Цэс харах",
    },
  }[language];

  return (
    <main className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-orb left-[-4rem] top-40 h-40 w-40 bg-primary/12" />
        <div className="ambient-orb right-[-5rem] top-[40rem] h-56 w-56 bg-primary/8" style={{ animationDelay: "-5s" }} />
        <div className="absolute inset-x-0 top-0 h-[38rem] bg-[linear-gradient(180deg,hsl(40_36%_97%/.56),transparent)] dark:bg-[linear-gradient(180deg,hsl(20_14%_10%/.6),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[42rem] bg-[linear-gradient(180deg,transparent,hsl(32_26%_91%/.7))] dark:bg-[linear-gradient(180deg,transparent,hsl(18_16%_6%/.74))]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-6 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 font-sans text-[11px] uppercase tracking-[0.2em] text-foreground/80 shadow-[inset_0_1px_0_hsl(0_0%_100%/.04)] transition-colors hover:bg-white/10 hover:text-foreground"
        >
          {copy.back}
        </Link>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {copy.menu}
        </Link>
      </div>

      <div className="relative z-10">
        <ReservationSection />
        <FooterSection />
      </div>
    </main>
  );
};

export default Reservation;
