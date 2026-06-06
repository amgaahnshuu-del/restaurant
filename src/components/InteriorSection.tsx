import { motion } from "framer-motion";
import interior1 from "@/assets/interior-1.jpg";
import interior2 from "@/assets/interior-2.jpg";
import interior3 from "@/assets/interior-3.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, MapPin } from "lucide-react";

const InteriorSection = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      kicker: "Atmosphere",
      title1: "Rooms with a",
      title2: "refined glow.",
      subtitle: "Each space designed to shape a different kind of evening",
      interiors: [
        {
          image: interior1,
          title: "Main dining room",
          desc: "A warm, layered space for elegant dinners and meaningful conversation.",
          features: ["Elegant dinners", "36 seats", "Golden hour light"],
        },
        {
          image: interior2,
          title: "Private room",
          desc: "An intimate setting for celebrations, executive dinners, and small events.",
          features: ["Private events", "12 seats", "Personalized service"],
        },
        {
          image: interior3,
          title: "Bar lounge",
          desc: "A slower corner for cocktails, wine pours, and after-dinner moments.",
          features: ["Signature cocktails", "Wine cellar", "Live ambience"],
        },
      ],
    },
    mn: {
      kicker: "Уур Амьсгал",
      title1: "Тансаг гэрэлтэй",
      title2: "өрөөнүүд.",
      subtitle: "Өөр өөр үдэш бүрийг бүтээх зориулалттай орон зайнууд",
      interiors: [
        {
          image: interior1,
          title: "Үндсэн зоогийн танхим",
          desc: "Гоёмсог оройн хоол, утга учиртай ярианд зориулагдсан дулаан орон зай.",
          features: ["Гоёмсог оройн хоол", "36 суудал", "Алтан туяа"],
        },
        {
          image: interior2,
          title: "Хувийн өрөө",
          desc: "Тэмдэглэлт үйл явдал, албаны уулзалт, жижиг эвентэд тохирсон нам гүм орчин.",
          features: ["Хувийн арга хэмжээ", "12 суудал", "Тусгай үйлчилгээ"],
        },
        {
          image: interior3,
          title: "Лаунж баар",
          desc: "Коктейль, дарс, оройн дараах тайван мөчүүдэд зориулагдсан булан.",
          features: ["Онцгой коктейль", "Дарсны агуулах", "Амьд уур амьсгал"],
        },
      ],
    },
  }[language];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-50/20 to-transparent dark:via-amber-950/5" />
      
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
            {copy.subtitle}
          </p>
        </motion.div>

        {/* Interiors Grid */}
        <div className="grid gap-5 sm:gap-6 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {copy.interiors.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              className="group rounded-2xl sm:rounded-3xl border-2 border-amber-600/20 dark:border-amber-500/20 bg-white/90 dark:bg-black/40 backdrop-blur-md shadow-xl hover:border-amber-600/40 dark:hover:border-amber-500/40 hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                {/* Feature Tags */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                  {item.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] sm:text-[10px] uppercase tracking-[0.1em] bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white/90 border border-white/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-medium text-neutral-800 dark:text-neutral-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {item.desc}
                </p>
                
                {/* Decorative Line */}
                <div className="mt-4 pt-4 border-t border-amber-600/20 dark:border-amber-500/20">
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
                    <MapPin className="h-3 w-3" />
                    <span className="font-sans uppercase tracking-[0.15em]">
                      {language === 'en' ? 'Available for booking' : 'Захиалга хүлээн авна'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full border-2 border-amber-600/30 dark:border-amber-500/30 bg-white/90 dark:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-md shadow-lg">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 animate-pulse" />
            <span className="font-sans text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              {language === 'en' 
                ? 'Each room tells a different story — choose yours' 
                : 'Өрөө бүр өөр өөр түүхийг өгүүлдэг — Өөрийгөө сонго'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteriorSection;