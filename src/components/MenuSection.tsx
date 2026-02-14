import { motion } from "framer-motion";
import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";
import dish4 from "@/assets/dish-4.jpg";
import dish5 from "@/assets/dish-5.jpg";
import dish6 from "@/assets/dish-6.jpg";

const menuItems = [
  {
    image: dish1,
    name: "Алтан навч",
    description: "Шарсан фуа гра, улирлын жимс, алтан навч чимэглэлтэй",
    price: "₮89,000",
  },
  {
    image: dish2,
    name: "Шоколадны симфони",
    description: "Гурван давхар шоколад бялуу, карамель ба ваниль мөс",
    price: "₮65,000",
  },
  {
    image: dish3,
    name: "Далайн эрдэнэ",
    description: "Лобстер, хясаа, далайн гахай, трюфель тосон дүүжинтэй",
    price: "₮125,000",
  },
  {
    image: dish4,
    name: "Вагью стейк",
    description: "А5 зэрэглэлийн вагью үхрийн мах, трюфель соустой, ногооны чимэглэлтэй",
    price: "₮145,000",
  },
  {
    image: dish5,
    name: "Алтан салмон",
    description: "Шарсан салмон филе, сарнайн цөцгийн тос, аспарагустай",
    price: "₮98,000",
  },
  {
    image: dish6,
    name: "Трюфель ризотто",
    description: "Мөөгний ризотто, пармезан бяслаг, трюфель тостой",
    price: "₮78,000",
  },
];

const MenuSection = () => {
  return (
    <section id="цэс" className="py-32 px-8 lg:px-16 bg-card">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase text-primary divider-ornament">
            Онцлох цэс
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-8">
            Шилдэг <span className="italic text-primary">амтууд</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative overflow-hidden mb-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="font-sans text-xs tracking-[0.2em] text-primary">
                    {item.price}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-2">
                  {item.name}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
