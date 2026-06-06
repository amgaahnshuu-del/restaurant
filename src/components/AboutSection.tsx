import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Quote, Sparkles } from "lucide-react";

const AboutSection = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      stats: [
        { number: "15+", label: "Years refining the craft" },
        { number: "50+", label: "Signature plates and pours" },
        { number: "1000+", label: "Guests hosted with care" },
      ],
      kicker: "Our Story",
      title1: "Built for guests who notice",
      title2: "the details.",
      body: "Gusto brings together refined service, thoughtfully sourced ingredients, and a dining room shaped around warmth rather than noise. Every plate is designed to feel ceremonial without losing comfort.",
      quote: "The best dining rooms don't just serve food. They shape a feeling that stays with the guest long after the table is cleared.",
      quoteAuthor: "— Gusto Founder",
      cards: [
        {
          title: "Seasonal composition",
          body: "Menus shift with ingredients, mood, and the pace of the room.",
        },
        {
          title: "Calm hospitality",
          body: "Service is attentive and polished, never rushed or performative.",
        },
        {
          title: "Designed atmosphere",
          body: "Soft lighting, layered textures, and warm metallic tones create the signature look.",
        },
      ],
    },
    mn: {
      stats: [
        { number: "15+", label: "Ур чадвараа төгөлдөржүүлсэн жил" },
        { number: "50+", label: "Онцгой хоол, ундааны сонголт" },
        { number: "1000+", label: "Нямбай хүлээн авсан зочид" },
      ],
      kicker: "Бидний Түүх",
      title1: "Нарийн мэдрэмжийг",
      title2: "анзаардаг зочдод зориулав.",
      body: "Gusto нь нямбай үйлчилгээ, чанартай орц, дулаан уур амьсгалтай зоогийн өрөөг нэг дор цогцлооно. Хоол бүр тансаг мэдрэмж төрүүлэх атлаа тав тухыг хадгална.",
      quote: "Шилдэг ресторан зөвхөн хоол үйлчилдэггүй. Харин ширээ хураасны дараа ч зочны сэтгэлд үлдэх мэдрэмжийг бүтээдэг.",
      quoteAuthor: "— Gusto Үүсгэн байгуулагч",
      cards: [
        {
          title: "Улирлын найрлага",
          body: "Цэс нь орц, уур амьсгал, оройн хэмнэлтэй хамт шинэчлэгддэг.",
        },
        {
          title: "Тайван зочломтгой байдал",
          body: "Үйлчилгээ нь анхааралтай, өнгөлөг боловч яаруу эсвэл хиймэл биш.",
        },
        {
          title: "Төлөвлөсөн орчин",
          body: "Зөөлөн гэрэл, давхар бүтэц, дулаан металл өнгө нь Gusto-гийн төрхийг бүрдүүлдэг.",
        },
      ],
    },
  }[language];

  return (
    <section id="story" className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/30 to-transparent dark:via-amber-950/10" />
      
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
            <span className="block italic text-amber-700 dark:text-amber-500 mt-1 sm:mt-2">
              {copy.title2}
            </span>
          </h2>
          
          <p className="max-w-2xl mx-auto mt-4 sm:mt-6 text-sm sm:text-base md:text-lg leading-relaxed sm:leading-7 text-neutral-700 dark:text-neutral-300">
            {copy.body}
          </p>
        </motion.div>

        {/* Quote and Cards Grid */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 xl:gap-12 lg:items-start">
          {/* Quote Card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative rounded-2xl sm:rounded-3xl border-2 border-amber-600/30 dark:border-amber-500/30 bg-white/90 dark:bg-black/40 p-6 sm:p-8 md:p-10 backdrop-blur-md shadow-xl hover:border-amber-600/50 dark:hover:border-amber-500/50 transition-all duration-300"
          >
            <Quote className="absolute top-6 right-6 h-8 w-8 sm:h-10 sm:w-10 text-amber-600/20 dark:text-amber-400/20" />
            <p className="font-body text-xl sm:text-2xl md:text-3xl leading-relaxed sm:leading-10 text-neutral-800 dark:text-neutral-200 relative z-10">
              "{copy.quote}"
            </p>
            <p className="mt-4 sm:mt-6 font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              {copy.quoteAuthor}
            </p>
          </motion.div>

          {/* Features Cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid gap-4 sm:gap-5"
          >
            {copy.cards.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="rounded-xl sm:rounded-2xl border-2 border-amber-600/20 dark:border-amber-500/20 bg-white/90 dark:bg-white/10 p-5 sm:p-6 backdrop-blur-sm shadow-lg hover:border-amber-600/40 dark:hover:border-amber-500/40 hover:bg-white/95 dark:hover:bg-white/15 transition-all duration-300"
              >
                <h3 className="font-sans text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.24em] sm:tracking-[0.28em] text-amber-700 dark:text-amber-400 font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 sm:mt-3 font-sans text-xs sm:text-sm leading-relaxed sm:leading-7 text-neutral-600 dark:text-neutral-300">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 sm:mt-12 md:mt-16 grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 sm:grid-cols-3"
        >
          {copy.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-xl sm:rounded-2xl border-2 border-amber-600/25 dark:border-amber-500/25 bg-gradient-to-br from-amber-50/80 to-white/80 dark:from-amber-950/20 dark:to-black/30 px-4 sm:px-6 py-5 sm:py-6 md:py-8 text-center backdrop-blur-sm shadow-lg hover:border-amber-600/45 dark:hover:border-amber-500/45 hover:shadow-xl transition-all duration-300"
            >
              <span className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-amber-700 dark:text-amber-400 font-semibold">
                {stat.number}
              </span>
              <p className="mt-2 sm:mt-3 font-sans text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] md:tracking-[0.2em] text-neutral-600 dark:text-neutral-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;