import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import gustoLogo from "@/assets/gusto-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      navItems: [
        { label: "Story", href: "#story" },
        { label: "Highlights", href: "#highlights" },
        { label: "Reservations", href: "#reservation" },
        { label: "Contact", href: "#contact" },
      ],
      badge: "Fine Dining",
      subBadge: "Crafted for evenings worth remembering",
      menuButton: "See Full Menu",
      sparkles: "Elevated dining in Ulaanbaatar",
      title1: "A quieter, richer way",
      title2: "to experience dinner.",
      body:
        "Seasonal plates, polished service, and a warmly lit room designed for date nights, celebrations, and slow conversations.",
      reserve: "Reserve a Table",
      explore: "Explore Menu",
      tonight: "Tonight at Gusto",
      open: "Open",
      moodLabel: "Signature mood",
      moodValue: "Golden interiors, live ambience, plated elegance.",
      years: "Years of craft",
      dishes: "Curated dishes",
      evenings: "Memorable evenings",
      imageAlt: "Elegant fine dining restaurant interior",
    },
    mn: {
      navItems: [
        { label: "Түүх", href: "#story" },
        { label: "Онцлох", href: "#highlights" },
        { label: "Захиалга", href: "#reservation" },
        { label: "Холбоо барих", href: "#contact" },
      ],
      badge: "Итали ресторан",
      subBadge: "Мартагдашгүй үдэш бүрт зориулав",
      menuButton: "Бүтэн цэс",
      sparkles: "Улаанбаатар дахь дээд зэрэглэлийн зоог",
      title1: "Оройн хоолыг",
      title2: "илүү онцгой мэдрэх орон зай.",
      body:
        "Улирлын онцлогтой хоол, нямбай үйлчилгээ, дулаан гэрэлтүүлэгтэй орчин нь болзоо, баяр ёслол, тайван ярианд зориулагдсан.",
      reserve: "Ширээ Захиалах",
      explore: "Цэс Үзэх",
      tonight: "Өнөө орой Gusto-д",
      open: "Нээлттэй",
      moodLabel: "Уур амьсгал",
      moodValue: "Алтан туяатай интерьер, амьд хөг, гоёмсог таваглалт.",
      years: "Жилийн туршлага",
      dishes: "Сонгомол хоол",
      evenings: "Дурсамжит үдэш",
      imageAlt: "Тансаг итали рестораны интерьер",
    },
  }[language];

  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/background/background.JPG"
          alt={copy.imageAlt}
          className="h-full w-full scale-[1.04] object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(41_36%_97%/.56),hsl(39_30%_94%/.72),hsl(36_28%_91%/.92))] dark:bg-[linear-gradient(180deg,hsl(20_14%_8%/.58),hsl(20_14%_8%/.76),hsl(18_16%_6%/.9))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(40_60%_50%/.14),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,hsl(40_58%_56%/.22),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(40_34%_96%/.22),transparent_24%,transparent_76%,hsl(36_28%_91%/.16))] dark:bg-[linear-gradient(90deg,hsl(20_14%_8%/.28),transparent_24%,transparent_76%,hsl(18_16%_6%/.18))]" />
        <div className="mesh-overlay opacity-25" />
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 12, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="ambient-orb left-[8%] top-[16%] h-36 w-36 bg-primary/20"
        />
        <motion.div
          animate={{ y: [0, 18, 0], x: [0, -14, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="ambient-orb bottom-[18%] right-[10%] h-44 w-44 bg-primary/12"
        />
      </div>

      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 pb-4 pt-16 lg:px-10"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-white/70 bg-white/80 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.3em] text-primary/80 shadow-[0_10px_24px_hsl(28_25%_35%/.08)] dark:border-white/10 dark:bg-white/10 dark:shadow-[0_14px_35px_hsl(0_0%_0%/.28)]">
            {copy.badge}
          </div>
          <span className="hidden font-sans text-[11px] uppercase tracking-[0.25em] text-foreground/55 md:inline">
            {copy.subBadge}
          </span>
        </div>

        <div className="hidden items-center gap-7 md:flex">
          {copy.navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-sans text-[11px] uppercase tracking-[0.24em] text-foreground/72 transition-colors duration-300 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/menu#full-menu"
            className="rounded-full border border-primary/30 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.24em] text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            {copy.menuButton}
          </Link>
        </div>
      </motion.nav>

      <div className="relative z-10 mx-auto flex min-h-[calc(88vh-96px)] max-w-7xl items-center px-6 pb-14 lg:px-10">
        <div className="grid w-full items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="gold-shimmer mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 shadow-[0_14px_34px_hsl(28_25%_35%/.08)] backdrop-blur-sm dark:bg-white/10 dark:shadow-[0_14px_35px_hsl(0_0%_0%/.28)]"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-sans text-[11px] uppercase tracking-[0.34em] text-primary/85">
                {copy.sparkles}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="mb-6"
            >
              <motion.img
                src={gustoLogo}
                alt="Gusto Restaurant"
                className="mb-6 h-24 w-auto md:h-32 lg:h-40"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <h1 className="max-w-3xl text-5xl font-light leading-[0.92] text-foreground md:text-7xl lg:text-[5.75rem]">
                {copy.title1}
                <span className="block italic text-primary">{copy.title2}</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="max-w-xl font-sans text-base leading-8 text-foreground/72 md:text-lg"
            >
              {copy.body}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <a
                href="#reservation"
                className="gold-shimmer inline-flex items-center justify-center gap-3 rounded-full bg-primary px-7 py-3.5 font-sans text-[11px] uppercase tracking-[0.25em] text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_hsl(40_60%_50%/.22)]"
              >
                {copy.reserve}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/menu#full-menu"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-border/80 bg-white/85 px-7 py-3.5 font-sans text-[11px] uppercase tracking-[0.25em] text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:border-primary/30"
              >
                {copy.explore}
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1 }}
            className="grid gap-4 self-center lg:justify-self-end"
          >
            <div className="hover-lift max-w-sm rounded-[28px] border border-white/70 bg-white/78 p-6 shadow-[0_24px_60px_hsl(28_25%_35%/.12)] backdrop-blur-md dark:border-white/10 dark:bg-black/30 dark:shadow-[0_24px_60px_hsl(0_0%_0%/.28)]">
              <div className="mb-5 flex items-center justify-between">
                <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-primary/80">
                  {copy.tonight}
                </span>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-200">
                  {copy.open}
                </span>
              </div>

              <div className="space-y-4 text-foreground/76">
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-foreground/45">
                    {copy.moodLabel}
                  </p>
                  <p className="mt-1 text-lg text-foreground">{copy.moodValue}</p>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-primary" />
                  <p className="font-sans text-sm leading-6">
                    Yzguurtan Tsogtsolbor, 5 dawhar
                    <span className="block text-foreground/55">Ulaanbaatar</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[
                { value: "15+", label: copy.years },
                { value: "50+", label: copy.dishes },
                { value: "1k+", label: copy.evenings },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[22px] border border-white/70 bg-white/78 px-4 py-5 text-center shadow-[0_18px_45px_hsl(28_25%_35%/.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/10 dark:shadow-[0_18px_40px_hsl(0_0%_0%/.22)]"
                >
                  <div className="font-display text-3xl text-primary">{item.value}</div>
                  <div className="mt-2 font-sans text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="page-fade" />
    </section>
  );
};

export default HeroSection;
