import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone, Sparkles, ExternalLink } from "lucide-react";
import exterior1 from "@/assets/exterior-1.jpg";
import exterior2 from "@/assets/exterior-2.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactSection = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      kicker: "Visit Us",
      title1: "Plan your next",
      title2: "evening out.",
      body: "Reach us directly for table reservations, private dining requests, or event inquiries.",
      items: [
        {
          icon: MapPin,
          title: "Location",
          lines: ["Yzguurtan Tsogtsolbor, 5th floor", "23rd khoroo, Ulaanbaatar 17032"],
          action: "Get Directions",
        },
        {
          icon: Phone,
          title: "Call us",
          lines: ["+976 77336969", "+976 85857520"],
          action: "Call Now",
        },
        {
          icon: Mail,
          title: "Email",
          lines: ["info@gusto.mn", "reservation@gusto.mn"],
          action: "Send Email",
        },
        {
          icon: Clock,
          title: "Hours",
          lines: ["Monday - Friday: 09:00 - 00:00", "Saturday - Sunday: 10:00 - 00:00"],
          action: "Book a Table",
        },
      ],
      exterior: "Exterior Views",
      mapTitle: "Gusto restaurant location",
      exteriorAlt: "Gusto exterior",
      openHours: "Open Today",
      reserveDirect: "Reserve directly",
    },
    mn: {
      kicker: "Бидэнтэй Холбогдох",
      title1: "Дараагийн",
      title2: "оройгоо төлөвлө.",
      body: "Ширээ захиалга, хувийн хооллолт, эвенттэй холбоотой асуултаар бидэнтэй шууд холбогдоорой.",
      items: [
        {
          icon: MapPin,
          title: "Байршил",
          lines: ["Язгууртан цогцолбор, 5 давхар", "23-р хороо, Улаанбаатар 17032"],
          action: "Чиглэл авах",
        },
        {
          icon: Phone,
          title: "Утас",
          lines: ["+976 77336969", "+976 85857520"],
          action: "Залгах",
        },
        {
          icon: Mail,
          title: "Имэйл",
          lines: ["info@gusto.mn", "reservation@gusto.mn"],
          action: "Имэйл илгээх",
        },
        {
          icon: Clock,
          title: "Цагийн хуваарь",
          lines: ["Даваа - Баасан: 09:00 - 00:00", "Бямба - Ням: 10:00 - 00:00"],
          action: "Ширээ захиалах",
        },
      ],
      exterior: "Гадна Талын Зураг",
      mapTitle: "Gusto рестораны байршил",
      exteriorAlt: "Gusto гадна төрх",
      openHours: "Өнөөдөр нээлттэй",
      reserveDirect: "Шууд захиалга",
    },
  }[language];

  return (
    <section id="contact" className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/30 to-amber-50/20 dark:via-amber-950/10 dark:to-amber-950/5" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-10 sm:mb-12 md:mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/20 bg-white/90 dark:bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
            <span className="font-sans text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-amber-700 dark:text-amber-400">
              {copy.kicker}
            </span>
          </div>
          
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] sm:leading-[1.05] md:leading-[0.95] tracking-tight">
            {copy.title1}
            <span className="italic text-amber-700 dark:text-amber-500"> {copy.title2}</span>
          </h2>
          
          <p className="max-w-2xl mx-auto mt-3 sm:mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans tracking-wide">
            {copy.body}
          </p>
        </motion.div>

        {/* Contact Info and Map Grid */}
        <div className="mb-10 sm:mb-12 md:mb-16 grid gap-6 sm:gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Contact Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-4 sm:gap-5"
          >
            {copy.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-xl sm:rounded-2xl border-2 border-amber-600/20 dark:border-amber-500/20 bg-white/90 dark:bg-black/40 p-5 sm:p-6 backdrop-blur-md shadow-lg hover:border-amber-600/40 dark:hover:border-amber-500/40 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-full border-2 border-amber-600/30 bg-amber-600/10 p-2.5 sm:p-3 group-hover:bg-amber-600 group-hover:border-amber-600 transition-all duration-300">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700 dark:text-amber-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.26em] text-amber-700 dark:text-amber-400 font-semibold">
                        {item.title}
                      </h3>
                      <div className="mt-2 space-y-1 font-sans text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                        {item.lines.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                      <button className="mt-3 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center gap-1">
                        {item.action}
                        <ExternalLink className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group rounded-xl sm:rounded-2xl border-2 border-amber-600/20 dark:border-amber-500/20 bg-white/90 dark:bg-black/40 p-2 backdrop-blur-md shadow-lg hover:border-amber-600/40 dark:hover:border-amber-500/40 transition-all duration-300"
          >
            <div className="relative overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2673.8!2d106.9177!3d47.9185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDU1JzA2LjYiTiAxMDbCsDU1JzAzLjciRQ!5e0!3m2!1sen!2smn!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 420 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={copy.mapTitle}
                className="rounded-lg grayscale transition-all duration-700 group-hover:grayscale-0"
              />
              {/* Map Overlay Badge */}
              <div className="absolute top-4 right-4 bg-amber-600/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                <span className="font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-white">
                  {copy.reserveDirect}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Exterior Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 sm:mb-8 text-center">
            <div className="inline-flex items-center gap-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-600/50" />
              <span className="font-sans text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400">
                {copy.exterior}
              </span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-600/50" />
            </div>
          </div>
          
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2">
            {[exterior1, exterior2].map((image, index) => (
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group overflow-hidden rounded-xl sm:rounded-2xl border-2 border-amber-600/20 dark:border-amber-500/20 bg-white/90 dark:bg-black/40 backdrop-blur-md shadow-lg hover:border-amber-600/40 dark:hover:border-amber-500/40 transition-all duration-500"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={image}
                    alt={`${copy.exteriorAlt} ${index + 1}`}
                    className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-white font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      {copy.openHours}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <a
            href="/reservation"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-amber-600/40 dark:border-amber-500/40 bg-white/90 dark:bg-white/10 px-6 sm:px-8 py-3 sm:py-3.5 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-amber-700 dark:text-amber-400 backdrop-blur-sm shadow-lg transition-all duration-300 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-500 hover:border-amber-600 hover:shadow-xl"
          >
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            {copy.reserveDirect}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;