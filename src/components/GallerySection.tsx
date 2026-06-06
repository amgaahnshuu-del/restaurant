import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import guest1 from "@/assets/guest-1.jpg";
import guest2 from "@/assets/guest-2.jpg";
import guest3 from "@/assets/guest-3.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Camera, Calendar, Users } from "lucide-react";

const GallerySection = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      tabs: [
        {
          key: "events",
          label: "Events",
          icon: Calendar,
          images: [
            { src: event1, alt: "Evening event at Gusto", description: "Elegant evening gathering" },
            { src: event2, alt: "Elegant celebration setup", description: "Special celebration setup" },
            { src: event3, alt: "Chef-led dining showcase", description: "Chef's table experience" },
          ],
        },
        {
          key: "guests",
          label: "Guests",
          icon: Users,
          images: [
            { src: guest1, alt: "Couples dining at night", description: "Romantic dinner moments" },
            { src: guest2, alt: "Warm table conversation", description: "Intimate conversations" },
            { src: guest3, alt: "Friends enjoying dinner", description: "Joyful dining experiences" },
          ],
        },
      ],
      kicker: "Moments Captured",
      title1: "See the",
      title2: "experience",
      title3: "before you arrive.",
      viewMore: "View moment",
    },
    mn: {
      tabs: [
        {
          key: "events",
          label: "Эвентүүд",
          icon: Calendar,
          images: [
            { src: event1, alt: "Gusto дахь оройн эвент", description: "Тансаг оройн цуглаан" },
            { src: event2, alt: "Тансаг баярын засал", description: "Онцгой баярын чимэглэл" },
            { src: event3, alt: "Тогоочийн оролцоотой оройн хоол", description: "Тогоочийн ширээний туршлага" },
          ],
        },
        {
          key: "guests",
          label: "Зочид",
          icon: Users,
          images: [
            { src: guest1, alt: "Оройн зоог барьж буй хосууд", description: "Романтик оройн хоол" },
            { src: guest2, alt: "Дулаан уур амьсгалтай яриа", description: "Дотно ярилцлага" },
            { src: guest3, alt: "Оройн хооллож буй найзууд", description: "Баяр хөөртэй хоолны туршлага" },
          ],
        },
      ],
      kicker: "Зургийн Сан",
      title1: "Ирэхээсээ өмнө",
      title2: "орчныг",
      title3: "мэдрээрэй.",
      viewMore: "Мөчийг харах",
    },
  }[language];

  const [activeTab, setActiveTab] = useState("events");
  const activeImages = copy.tabs.find((tab) => tab.key === activeTab)?.images ?? [];

  return (
    <section id="gallery" className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/20 to-transparent dark:via-amber-950/5" />
      
      {/* Decorative elements */}
      <div className="absolute top-40 left-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl" />
      
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
            <Camera className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
            <span className="font-sans text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-amber-700 dark:text-amber-400">
              {copy.kicker}
            </span>
          </div>
          
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] sm:leading-[1.05] md:leading-[0.95] tracking-tight">
            {copy.title1}{' '}
            <span className="italic text-amber-700 dark:text-amber-500">{copy.title2}</span>
            {' '}{copy.title3}
          </h2>
        </motion.div>

        {/* Tab Buttons */}
        <div className="mb-8 sm:mb-10 md:mb-12 flex justify-center gap-3 sm:gap-4">
          {copy.tabs.map((tab) => (
            <motion.button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`group flex items-center gap-2 rounded-full border-2 px-4 sm:px-6 py-2 sm:py-2.5 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.15em] transition-all duration-300 ${
                activeTab === tab.key
                  ? "border-amber-600/60 bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                  : "border-amber-600/30 bg-white/80 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 hover:border-amber-600/50 hover:bg-amber-600/10"
              }`}
            >
              <tab.icon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-colors ${
                activeTab === tab.key ? "text-white" : "text-amber-600"
              }`} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Gallery Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {activeImages.map((img, i) => (
              <motion.div
                key={img.alt}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl border-2 border-amber-600/20 dark:border-amber-500/20 bg-white/90 dark:bg-black/40 backdrop-blur-sm shadow-xl hover:border-amber-600/40 dark:hover:border-amber-500/40 hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <p className="text-white font-sans text-sm sm:text-base font-medium mb-1">
                      {img.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      <span className="text-white/80 font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">
                        {copy.viewMore}
                      </span>
                    </div>
                  </div>
                  
                  {/* Decorative badge */}
                  <div className="absolute top-3 right-3 bg-amber-600/90 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="h-3 w-3 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Decorative Line */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: "auto" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-16 flex justify-center"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-600/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-600/60" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-600/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;