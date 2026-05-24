import { motion } from "framer-motion";
import interior1 from "@/assets/interior-1.jpg";
import interior2 from "@/assets/interior-2.jpg";
import interior3 from "@/assets/interior-3.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const InteriorSection = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      kicker: "Atmosphere",
      title1: "Rooms with a",
      title2: "refined glow.",
      interiors: [
        {
          image: interior1,
          title: "Main dining room",
          desc: "A warm, layered space for elegant dinners and meaningful conversation.",
        },
        {
          image: interior2,
          title: "Private room",
          desc: "An intimate setting for celebrations, executive dinners, and small events.",
        },
        {
          image: interior3,
          title: "Bar lounge",
          desc: "A slower corner for cocktails, wine pours, and after-dinner moments.",
        },
      ],
    },
    mn: {
      kicker: "Уур Амьсгал",
      title1: "Тансаг гэрэлтэй",
      title2: "өрөөнүүд.",
      interiors: [
        {
          image: interior1,
          title: "Үндсэн зоогийн танхим",
          desc: "Гоёмсог оройн хоол, утга учиртай ярианд зориулагдсан дулаан орон зай.",
        },
        {
          image: interior2,
          title: "Хувийн өрөө",
          desc: "Тэмдэглэлт үйл явдал, албаны уулзалт, жижиг эвентэд тохирсон нам гүм орчин.",
        },
        {
          image: interior3,
          title: "Лаунж баар",
          desc: "Коктейль, дарс, оройн дараах тайван мөчүүдэд зориулагдсан булан.",
        },
      ],
    },
  }[language];

  return (
    <section className="px-6 py-20 lg:px-16">
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
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {copy.interiors.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group overflow-hidden rounded-[30px] border border-white/70 bg-white/76 shadow-[0_20px_48px_hsl(28_25%_35%/.08)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_20px_40px_hsl(0_0%_0%/.2)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-background/10 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl text-foreground">{item.title}</h3>
                <p className="mt-3 font-sans text-sm leading-7 text-muted-foreground/78">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteriorSection;
