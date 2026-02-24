import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="тухай" className="py-32 px-8 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase text-primary divider-ornament">
            Бидний тухай
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-10 leading-tight">
            Амтны <span className="italic text-primary">урлаг</span> бол
            <br />
            бидний ойрын зорилго.
          </h2>

          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Gusto бол зүгээр нэг ресторан биш — энэ бол таны мэдрэхүйг сэрээж,
            дурсамж бүтээх газар. Бид дэлхийн шилдэг орцуудыг монгол уламжлалтай
            хослуулан, давтагдашгүй амт чанарыг бүтээдэг.
          </p>

          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Манай тогооч нар олон улсын туршлагатай бөгөөд хоол бүрийг урлагийн
            бүтээл мэт бэлтгэдэг.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-3 gap-8 mt-20 border-t border-border pt-16"
        >
          {[
            { number: "15+", label: "Жилийн туршлага" },
            { number: "50+", label: "Онцгой цэс" },
            { number: "1000+", label: "Сэтгэл ханамжтай үйлчлүүлэгч" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="font-display text-3xl md:text-4xl text-primary">
                {stat.number}
              </span>
              <p className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground mt-3">
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
