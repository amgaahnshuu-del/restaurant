import { motion } from "framer-motion";
import chef2 from "@/assets/chef-2.jpg";
import chef3 from "@/assets/chef-3.jpg";

const team = [
  { image: "/chef/huslen.jpg", name: "Б. Батболд", role: "Ерөнхий тогооч", desc: "15 жилийн олон улсын туршлагатай, Франц, Японд суралцсан" },
  { image: chef2, name: "О. Сарангэрэл", role: "Дэд тогооч", desc: "Амттан болон зуушны мэргэжилтэн, Италид мэргэшсэн" },
  { image: chef3, name: "Д. Ганбаатар", role: "Сомелье", desc: "Дэлхийн 500+ дарсны мэдлэгтэй, WSET сертификаттай" },
];

const TeamSection = () => {
  return (
    <section className="py-20 px-8 lg:px-16 bg-card">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase text-primary divider-ornament">
            Манай баг
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-5">
            Шилдэг <span className="italic text-primary">мэргэжилтнүүд</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center group"
            >
              <div className="relative overflow-hidden mb-6 mx-auto w-56 h-56">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="font-display text-2xl text-foreground mb-1">{member.name}</h3>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-primary block mb-3">
                {member.role}
              </span>
              <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {member.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
