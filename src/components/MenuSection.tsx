import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import signatureDish1 from "@/assets/signature-dish-1.jpg";
import signatureDish2 from "@/assets/signature-dish-2.jpg";
import signatureDish3 from "@/assets/signature-dish-3.jpg";
import cocktail1 from "@/assets/cocktail-1.jpg";
import cocktail2 from "@/assets/cocktail-2.jpg";
import cocktail3 from "@/assets/cocktail-3.jpg";

const highlights = [
  { image: signatureDish1, name: "Вагью Стейк", price: "₮145,000" },
  { image: cocktail1, name: "Old Fashioned", price: "₮28,000" },
  { image: signatureDish2, name: "Шарсан Салмон", price: "₮98,000" },
  { image: cocktail2, name: "Espresso Martini", price: "₮32,000" },
  { image: signatureDish3, name: "Мөөгний Ризотто", price: "₮78,000" },
  { image: cocktail3, name: "Negroni", price: "₮30,000" },
];

const MenuSection = () => {
  return (
    <section id="цэс" className="py-32 px-6 lg:px-16 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-sans text-[11px] tracking-[0.4em] uppercase text-primary/70">
            ✦ Онцлох цэс ✦
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-6 mb-4">
            Шилдэг <span className="italic text-primary">амтууд</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground/60 max-w-lg mx-auto">
            Манай тогоочийн онцлох хоол ба коктейлнууд
          </p>
        </motion.div>

        {/* 6 Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-14">
          {highlights.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-xl aspect-[4/5]"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <span className="font-sans text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-primary/80 block mb-1">
                  {item.price}
                </span>
                <h3 className="font-display text-base md:text-lg text-white">
                  {item.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link
            to="/menu"
            className="inline-flex items-center gap-3 border border-primary/30 rounded-full px-10 py-4 font-sans text-[11px] tracking-[0.25em] uppercase text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 group"
          >
            Бүрэн цэс үзэх
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;
