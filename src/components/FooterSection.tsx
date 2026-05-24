import gustoLogo from "@/assets/gusto-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const FooterSection = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      body:
        "Gusto is a fine dining destination shaped around warm light, considered service, and menus built for memorable evenings.",
      hours: "Hours",
      contact: "Contact",
      h1: "Mon - Thu: 11:00 - 23:00",
      h2: "Fri - Sun: 10:00 - 00:00",
      address: "Yzguurtan Tsogtsolbor, Ulaanbaatar",
      footer: "2024 Gusto. Crafted for intimate nights and grand celebrations.",
    },
    mn: {
      body:
        "Gusto бол дулаан гэрэл, нямбай үйлчилгээ, дурсамжтай үдэш бүрт зориулсан цэсээрээ ялгардаг итали ресторан юм.",
      hours: "Цагийн Хуваарь",
      contact: "Холбоо Барих",
      h1: "Дав - Пүр: 11:00 - 23:00",
      h2: "Баас - Ням: 10:00 - 00:00",
      address: "Yzguurtan Tsogtsolbor, Улаанбаатар",
      footer: "2024 Gusto. Дотно орой, томоохон тэмдэглэлт мөчүүдэд зориулав.",
    },
  }[language];

  return (
    <footer className="border-t border-border/70 bg-white/60 px-6 py-12 backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.03] lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <img src={gustoLogo} alt="Gusto Restaurant" className="h-24 w-auto" />
          <p className="mt-5 max-w-md font-sans text-sm leading-7 text-muted-foreground/78">{copy.body}</p>
        </div>

        <div>
          <h4 className="font-sans text-[11px] uppercase tracking-[0.26em] text-primary/80">{copy.hours}</h4>
          <div className="mt-4 space-y-2 font-sans text-sm text-muted-foreground/76">
            <p>{copy.h1}</p>
            <p>{copy.h2}</p>
          </div>
        </div>

        <div>
          <h4 className="font-sans text-[11px] uppercase tracking-[0.26em] text-primary/80">{copy.contact}</h4>
          <div className="mt-4 space-y-2 font-sans text-sm text-muted-foreground/76">
            <p>{copy.address}</p>
            <p>+976 7700 1234</p>
            <p>info@gusto.mn</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-border/70 pt-5 dark:border-white/5">
        <p className="text-center font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground/56">
          {copy.footer}
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
