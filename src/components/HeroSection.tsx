import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles, User, Menu, X } from "lucide-react";
import gustoLogo from "@/assets/gusto-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const { language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copy = {
    en: {
      navItems: [
        { label: "Story", href: "#story" },
        { label: "Highlights", href: "#highlights" },
        { label: "Reservations", href: "/reservation" },
        { label: "Contact", href: "#contact" },
      ],
      badge: "Fine Dining",
      subBadge: "Crafted for evenings worth remembering",
      menuButton: "My Account",
      sparkles: "Elevated dining in Ulaanbaatar",
      title1: "A quieter, richer way",
      title2: "to experience dinner.",
      body: "Seasonal plates, polished service, and a warmly lit room designed for date nights, celebrations, and slow conversations.",
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
        { label: "Захиалга", href: "/reservation" },
        { label: "Холбоо барих", href: "#contact" },
      ],
      badge: "Итали ресторан",
      menuButton: "Миний бүртгэл",
      sparkles: "Улаанбаатар дахь дээд зэрэглэлийн зоог",
      title1: "Оройн хоолыг",
      title2: "илүү онцгой мэдрэх орон зай.",
      body: "Улирлын онцлогтой хоол, нямбай үйлчилгээ, дулаан гэрэлтүүлэгтэй орчин нь болзоо, баяр ёслол, тайван ярианд зориулагдсан.",
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
    <section className="relative min-h-screen overflow-hidden pt-14 sm:pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/background/background.JPG"
          alt={copy.imageAlt}
          className="h-full w-full object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 via-amber-100/40 to-amber-200/30 dark:from-neutral-900/70 dark:via-neutral-900/60 dark:to-neutral-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,theme(colors.amber.500/0.15),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,theme(colors.amber.600/0.2),transparent_50%)]" />
        
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 12, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:block ambient-orb absolute left-[8%] top-[16%] h-36 w-36 bg-amber-500/20"
        />
        <motion.div
          animate={{ y: [0, 18, 0], x: [0, -14, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:block ambient-orb absolute bottom-[18%] right-[10%] h-44 w-44 bg-amber-500/12"
        />
      </div>

      {/* Navigation - Reduced height */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl shadow-lg" 
            : "bg-white/70 dark:bg-neutral-950/50 backdrop-blur-2xl"
        }`}
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 sm:h-14 md:h-16 items-center justify-between gap-4">
            {/* Logo Section */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <img 
                src={gustoLogo} 
                alt="Gusto Restaurant" 
                className="h-6 w-auto sm:h-7 md:h-8 object-contain" 
              />
              <div className="hidden sm:block rounded-full border border-amber-700/30 bg-white/90 dark:bg-white/10 px-2.5 sm:px-3 py-0.5">
                <span className="font-sans text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-amber-800 dark:text-amber-400 whitespace-nowrap">
                  {copy.badge}
                </span>
              </div>
              <span className="hidden md:inline font-sans text-[10px] lg:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.25em] text-neutral-600 dark:text-neutral-400 truncate">
                {copy.subBadge}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 ">
              {copy.navItems.map((item) => (
                item.href === "/reservation" ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="font-sans text-[10px] lg:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.24em] text-neutral-700 dark:text-neutral-300 transition-colors duration-300 hover:text-amber-600 dark:hover:text-amber-400 whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                ) : item.href.startsWith("/") ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="font-sans text-[10px] lg:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.24em] text-neutral-700 dark:text-neutral-300 transition-colors duration-300 hover:text-amber-600 dark:hover:text-amber-400 whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="font-sans text-[10px] lg:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.24em] text-neutral-700 dark:text-neutral-300 transition-colors duration-300 hover:text-amber-600 dark:hover:text-amber-400 whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                )
              ))}
              <Link
                to="/account"
                className="inline-flex items-center justify-center gap-1.5 lg:gap-2 rounded-full border border-amber-600/30 px-3 lg:px-4 py-1.5 font-sans text-[10px] lg:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.24em] text-amber-700 dark:text-amber-400 transition-all duration-300 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-500 whitespace-nowrap"
              >
                <User className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                {copy.menuButton}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 shadow-xl"
            >
              <div className="flex flex-col p-4 space-y-3">
                {copy.navItems.map((item) => (
                  item.href === "/reservation" ? (
                    <a
                      key={item.label}
                      href={item.href}
                      className="font-sans text-sm uppercase tracking-[0.2em] text-neutral-700 dark:text-neutral-300 transition-colors duration-300 hover:text-amber-600 dark:hover:text-amber-400 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : item.href.startsWith("/") ? (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="font-sans text-sm uppercase tracking-[0.2em] text-neutral-700 dark:text-neutral-300 transition-colors duration-300 hover:text-amber-600 dark:hover:text-amber-400 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      className="font-sans text-sm uppercase tracking-[0.2em] text-neutral-700 dark:text-neutral-300 transition-colors duration-300 hover:text-amber-600 dark:hover:text-amber-400 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  )
                ))}
                <Link
                  to="/account"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-600/30 px-4 py-2.5 font-sans text-sm uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 transition-all duration-300 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  {copy.menuButton}
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <div className="flex-1 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-flex flex-wrap items-center gap-2 rounded-full border border-amber-600/20 bg-white/90 dark:bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 backdrop-blur-sm"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
              <span className="font-sans text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-amber-700 dark:text-amber-400">
                {copy.sparkles}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="mb-4 sm:mb-6"
            >
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-light leading-[1.1] sm:leading-[1.05] md:leading-[0.95] tracking-tight">
                {copy.title1}
                <span className="block italic text-amber-700 dark:text-amber-500 mt-1 sm:mt-2">
                  {copy.title2}
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-sm sm:text-base md:text-lg leading-relaxed sm:leading-7 text-neutral-700 dark:text-neutral-300 max-w-xl"
            >
              {copy.body}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <a
                href="/reservation"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full bg-amber-700 dark:bg-amber-600 px-5 sm:px-7 py-3 sm:py-3.5 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-600/20"
              >
                {copy.reserve}
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <Link
                to="/menu#full-menu"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full border border-neutral-300 dark:border-white/20 bg-white/90 dark:bg-white/10 px-5 sm:px-7 py-3 sm:py-3.5 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-700 dark:text-neutral-300 transition-all duration-300 hover:-translate-y-1 hover:border-amber-600/30 hover:text-amber-700 dark:hover:text-amber-400"
              >
                {copy.explore}
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Info Cards with Yellow/Brown Borders */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1 }}
            className="flex-1 lg:max-w-md xl:max-w-lg mt-8 lg:mt-0"
          >
            <div className="space-y-4 sm:space-y-6">
              {/* Tonight at Gusto Card - Yellow/Brown Border */}
              <div className="rounded-2xl sm:rounded-3xl border-2 border-amber-600/40 dark:border-amber-500/40 bg-white/90 dark:bg-black/40 p-5 sm:p-6 backdrop-blur-md shadow-xl hover:border-amber-600/60 dark:hover:border-amber-500/60 transition-all duration-300">
                <div className="mb-4 sm:mb-5 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-amber-700 dark:text-amber-400">
                    {copy.tonight}
                  </span>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 sm:px-3 py-1 font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                    {copy.open}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-2">
                      {copy.moodLabel}
                    </p>
                    <p className="text-base sm:text-lg text-neutral-800 dark:text-neutral-200 leading-relaxed">
                      {copy.moodValue}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 flex-shrink-0" />
                    <p className="font-sans text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                      Yzguurtan Tsogtsolbor, 5 dawhar
                      <span className="block text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
                        Ulaanbaatar
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid - Yellow/Brown Borders */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { value: "15+", label: copy.years },
                  { value: "50+", label: copy.dishes },
                  { value: "1k+", label: copy.evenings },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-xl sm:rounded-2xl border-2 border-amber-600/30 dark:border-amber-500/30 bg-white/90 dark:bg-white/10 px-2 sm:px-4 py-3 sm:py-5 text-center backdrop-blur-sm shadow-lg hover:border-amber-600/50 dark:hover:border-amber-500/50 hover:bg-white/95 dark:hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="font-display text-xl sm:text-2xl md:text-3xl text-amber-700 dark:text-amber-400 font-semibold">
                      {item.value}
                    </div>
                    <div className="mt-1 sm:mt-2 font-sans text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="page-fade" />
    </section>
  );
};

export default HeroSection;