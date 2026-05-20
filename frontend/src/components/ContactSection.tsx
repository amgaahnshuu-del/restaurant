import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import exterior1 from "@/assets/exterior-1.jpg";
import exterior2 from "@/assets/exterior-2.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactSection = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      kicker: "Contact",
      title1: "Plan your next",
      title2: "evening out.",
      body: "Reach us directly for table reservations, private dining requests, or event inquiries.",
      items: [
        {
          icon: MapPin,
          title: "Location",
          lines: ["Язгууртан цогцолбор, 5th floor", "23rd khoroo, Ulaanbaatar 17032"],
        },
        {
          icon: Phone,
          title: "Call us",
          lines: ["+976 77336969", "+976 85857520"],
        },
        {
          icon: Mail,
          title: "Email",
          lines: ["info@gusto.mn", "reservation@gusto.mn"],
        },
        {
          icon: Clock,
          title: "Hours",
          lines: ["Mon - friday: 09:00 - 00:00", "Sat - Sun: 10:00 - 00:00"],
        },
      ],
      exterior: "Exterior Views",
      mapTitle: "Gusto restaurant location",
      exteriorAlt: "Gusto exterior",
    },
    mn: {
      kicker: "Холбоо Барих",
      title1: "Дараагийн",
      title2: "оройгоо төлөвлө.",
      body: "Ширээ захиалга, хувийн хооллолт, эвенттэй холбоотой асуултаар бидэнтэй шууд холбогдоорой.",
      items: [
        {
          icon: MapPin,
          title: "Байршил",
          lines: ["Язгууртан цогцолбор, 5 давхар", "23-р хороо, Улаанбаатар 17032"],
        },
        {
          icon: Phone,
          title: "Утас",
          lines: ["+976 77336969", "+976 85857520"],
        },
        {
          icon: Mail,
          title: "Имэйл",
          lines: ["info@gusto.mn", "reservation@gusto.mn"],
        },
        {
          icon: Clock,
          title: "Цагийн хуваарь",
          lines: ["Дав - Бас: 09:00 - 00:00", "бям - Ням: 10:00 - 00:00"],
        },
      ],
      exterior: "Гадна Талын Зураг",
      mapTitle: "Gusto рестораны байршил",
      exteriorAlt: "Gusto гадна төрх",
    },
  }[language];

  return (
    <section id="contact" className="section-shell px-6 py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-center"
        >
          <span className="section-kicker">{copy.kicker}</span>
          <h2 className="mt-5 text-4xl font-light text-foreground md:text-5xl lg:text-6xl">
            {copy.title1}
            <span className="italic text-primary"> {copy.title2}</span>
          </h2>
          <p className="section-description mt-4">{copy.body}</p>
        </motion.div>

        <div className="mb-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-4"
          >
            {copy.items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[26px] border border-white/70 bg-white/82 p-6 shadow-[0_20px_50px_hsl(28_25%_35%/.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_20px_40px_hsl(0_0%_0%/.2)]">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full border border-primary/20 bg-primary/10 p-3">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-sans text-[11px] uppercase tracking-[0.26em] text-primary/80">
                        {item.title}
                      </h3>
                      <div className="mt-3 space-y-1.5 font-sans text-sm leading-7 text-foreground/74">
                        {item.lines.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[32px] border border-white/70 bg-white/82 p-3 shadow-[0_20px_50px_hsl(28_25%_35%/.08)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_20px_40px_hsl(0_0%_0%/.2)]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2673.8!2d106.9177!3d47.9185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDU1JzA2LjYiTiAxMDbCsDU1JzAzLjciRQ!5e0!3m2!1sen!2smn!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 420 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={copy.mapTitle}
              className="rounded-[24px] grayscale transition-all duration-700 hover:grayscale-0"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-7 text-center">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-primary/80">
              {copy.exterior}
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[exterior1, exterior2].map((image, index) => (
              <div key={image} className="group overflow-hidden rounded-[30px] border border-white/70 bg-white/82 shadow-[0_18px_42px_hsl(28_25%_35%/.08)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_18px_40px_hsl(0_0%_0%/.2)]">
                <img
                  src={image}
                  alt={`${copy.exteriorAlt} ${index + 1}`}
                  className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
