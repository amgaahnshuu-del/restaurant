import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import guest1 from "@/assets/guest-1.jpg";
import guest2 from "@/assets/guest-2.jpg";
import guest3 from "@/assets/guest-3.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const GallerySection = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      tabs: [
        {
          key: "events",
          label: "Events",
          images: [
            { src: event1, alt: "Evening event at Gusto" },
            { src: event2, alt: "Elegant celebration setup" },
            { src: event3, alt: "Chef-led dining showcase" },
          ],
        },
        {
          key: "guests",
          label: "Guests",
          images: [
            { src: guest1, alt: "Couples dining at night" },
            { src: guest2, alt: "Warm table conversation" },
            { src: guest3, alt: "Friends enjoying dinner" },
          ],
        },
      ],
      kicker: "Gallery",
      title1: "See the",
      title2: "experience",
      title3: "before you arrive.",
    },
    mn: {
      tabs: [
        {
          key: "events",
          label: "Эвентүүд",
          images: [
            { src: event1, alt: "Gusto дахь оройн эвент" },
            { src: event2, alt: "Тансаг баярын засал" },
            { src: event3, alt: "Тогоочийн оролцоотой оройн хоол" },
          ],
        },
        {
          key: "guests",
          label: "Зочид",
          images: [
            { src: guest1, alt: "Оройн зоог барьж буй хосууд" },
            { src: guest2, alt: "Дулаан уур амьсгалтай яриа" },
            { src: guest3, alt: "Оройн хооллож буй найзууд" },
          ],
        },
      ],
      kicker: "Зургийн Сан",
      title1: "Ирэхээсээ өмнө",
      title2: "орчныг",
      title3: "мэдрээрэй.",
    },
  }[language];

  const [activeTab, setActiveTab] = useState("events");
  const activeImages = copy.tabs.find((tab) => tab.key === activeTab)?.images ?? [];

  return (
    <section id="gallery" className="px-8 py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-center"
        >
          <span className="divider-ornament font-sans text-xs uppercase tracking-[0.4em] text-primary">
            {copy.kicker}
          </span>
          <h2 className="mt-5 font-display text-4xl font-light text-foreground md:text-5xl lg:text-6xl">
            {copy.title1} <span className="italic text-primary">{copy.title2}</span> {copy.title3}
          </h2>
        </motion.div>

        <div className="mb-8 flex justify-center gap-4">
          {copy.tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`border px-6 py-2 font-sans text-xs uppercase tracking-[0.15em] transition-all duration-300 ${
                activeTab === tab.key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid gap-4 md:grid-cols-3"
          >
            {activeImages.map((img, i) => (
              <motion.div
                key={img.alt}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-end bg-[linear-gradient(180deg,transparent,hsl(42_45%_98%/.92))] p-4 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                  <span className="font-body text-sm text-foreground">{img.alt}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GallerySection;
