import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import guest1 from "@/assets/guest-1.jpg";
import guest2 from "@/assets/guest-2.jpg";
import guest3 from "@/assets/guest-3.jpg";

const tabs = [
  {
    key: "events",
    label: "Үйл явдал",
    images: [
      { src: event1, alt: "Гала оройн зоог" },
      { src: event2, alt: "Дарс амсах арга хэмжээ" },
      { src: event3, alt: "Тогоочийн тусгай ширээ" },
    ],
  },
  {
    key: "guests",
    label: "Зочид",
    images: [
      { src: guest1, alt: "Хосуудын оройн зоог" },
      { src: guest2, alt: "Найз нөхдийн цуглаан" },
      { src: guest3, alt: "Бизнес уулзалт" },
    ],
  },
];

const GallerySection = () => {
  const [activeTab, setActiveTab] = useState("events");
  const activeImages = tabs.find((t) => t.key === activeTab)?.images ?? [];

  return (
    <section id="галерей" className="py-32 px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase text-primary divider-ornament">
            Галерей
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-8">
            Мөч <span className="italic text-primary">бүрийг</span> дурсамжлая
          </h2>
        </motion.div>

        <div className="flex justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-sans text-xs tracking-[0.15em] uppercase px-6 py-2 border transition-all duration-300 ${
                activeTab === tab.key
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
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
            className="grid md:grid-cols-3 gap-4"
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
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
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
