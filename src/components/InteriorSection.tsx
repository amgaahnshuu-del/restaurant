import { motion } from "framer-motion";
import interior1 from "@/assets/interior-1.jpg";
import interior2 from "@/assets/interior-2.jpg";
import interior3 from "@/assets/interior-3.jpg";

const interiors = [
  { image: interior1, title: "Үндсэн танхим", desc: "Дулаан гэрэлтүүлэг, арьсан суудалтай тохилог орчин" },
  { image: interior2, title: "VIP өрөө", desc: "Хувийн арга хэмжээнд зориулсан тусгай өрөө" },
  { image: interior3, title: "Бар хэсэг", desc: "Дэлхийн шилдэг ундааг таньд бэлтгэнэ" },
];

const InteriorSection = () => {
  return (
    <section className="py-32 px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase text-primary divider-ornament">
            Дотор орчин
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-8">
            Манай <span className="italic text-primary">орчин</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {interiors.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <div>
                  <h3 className="font-display text-xl text-foreground mb-1">{item.title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteriorSection;
