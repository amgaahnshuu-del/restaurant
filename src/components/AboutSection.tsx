import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

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
      body:
        "Gusto brings together refined service, thoughtfully sourced ingredients, and a dining room shaped around warmth rather than noise. Every plate is designed to feel ceremonial without losing comfort.",
      quote:
        "\"The best dining rooms don't just serve food. They shape a feeling that stays with the guest long after the table is cleared.\"",
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
      body:
        "Gusto нь нямбай үйлчилгээ, чанартай орц, дулаан уур амьсгалтай зоогийн өрөөг нэг дор цогцлооно. Хоол бүр тансаг мэдрэмж төрүүлэх атлаа тав тухыг хадгална.",
      quote:
        "\"Шилдэг ресторан зөвхөн хоол үйлчилдэггүй. Харин ширээ хураасны дараа ч зочны сэтгэлд үлдэх мэдрэмжийг бүтээдэг.\"",
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
    <section id="story" className="section-shell px-6 py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-center"
        >
          <span className="section-kicker">{copy.kicker}</span>
          <h2 className="mt-5 text-4xl font-light leading-tight text-foreground md:text-5xl lg:text-6xl">
            {copy.title1}
            <span className="block italic text-primary">{copy.title2}</span>
          </h2>
          <p className="section-description mt-4">{copy.body}</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="rounded-[32px] border border-white/70 bg-white/82 p-8 shadow-[0_25px_80px_hsl(28_25%_35%/.1)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_25px_80px_hsl(0_0%_0%/.25)] md:p-10"
          >
            <p className="font-body text-2xl leading-10 text-foreground/88">
              {copy.quote}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid gap-5"
          >
            {copy.cards.map((item) => (
              <div key={item.title} className="rounded-[28px] border border-border/70 bg-white/72 p-6 shadow-[0_18px_42px_hsl(28_25%_35%/.06)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                <h3 className="font-sans text-xs uppercase tracking-[0.28em] text-primary/80">{item.title}</h3>
                <p className="mt-3 font-sans text-sm leading-7 text-muted-foreground/80">{item.body}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 grid gap-5 md:grid-cols-3"
        >
          {copy.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[28px] border border-primary/10 bg-primary/[0.04] px-6 py-6 text-center"
            >
              <span className="font-display text-4xl text-primary md:text-5xl">{stat.number}</span>
              <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground/75">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
