import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";
import dish4 from "@/assets/dish-4.png";
import dish5 from "@/assets/dish-5.png";
import dish6 from "@/assets/dish-6.png";
import drink1 from "@/assets/drink-1.jpg";
import drink2 from "@/assets/drink-2.jpg";
import wine1 from "@/assets/wine-1.jpg";
import wine2 from "@/assets/wine-2.jpg";
import appetizer1 from "@/assets/appetizer-1.jpg";
import appetizer2 from "@/assets/appetizer-2.jpg";
import dessert1 from "@/assets/dessert-1.jpg";
import dessert2 from "@/assets/dessert-2.jpg";

type MenuItem = {
  image: string;
  name: string;
  description: string;
  price: string;
};

const categories: { key: string; label: string; items: MenuItem[] }[] = [
  {
    key: "main",
    label: "Үндсэн хоол",
    items: [
      { image: dish1, name: "Шарсан фуа гра", description: " чимэглэлтэй", price: "₮000" },
      { image: dish4, name: "Вагью үхрийн мах", description: "А5 зэрэглэлийн вагью үхрийн мах, трюфель соустой", price: "₮145,000" },
      { image: dish5, name: "Шарсан салмон", description: "Шарсан салмон филе, сарнайн цөцгийн тос, аспарагустай", price: "₮98,000" },
      { image: dish6, name: "Мөөгний ризотто", description: "Мөөгний ризотто, пармезан бяслаг, трюфель тостой", price: "₮78,000" },
      { image: dish3, name: "Лобстер", description: "Лобстер, хясаа, далайн гахай, трюфель тосон дүүжинтэй", price: "₮125,000" },
    ],
  },
  {
    key: "appetizer",
    label: "Зууш",
    items: [
      { image: appetizer1, name: "Брускетта", description: "Италийн прошутто, инжир, зөгийн бал, рикотта бяслагтай", price: "₮45,000" },
      { image: appetizer2, name: "Тунаг загас", description: "Шинэхэн тунаг загас, авокадо, васаби соустой", price: "₮55,000" },
    ],
  },
  {
    key: "dessert",
    label: "Амттан",
    items: [
      { image: dish2, name: "Шоколад суфле", description: "Гурван давхар шоколад бялуу, карамель ба ваниль мөс", price: "₮65,000" },
      { image: dessert1, name: "Ваниль крем брюле", description: "Классик ваниль крем брюле, улирлын жимстэй", price: "₮42,000" },
      { image: dessert2, name: "Тирамису", description: "Италийн уламжлалт тирамису, маскарпоне бяслагтай", price: "₮48,000" },
    ],
  },
  {
    key: "drinks",
    label: "Ундаа",
    items: [
      { image: drink1, name: "Gusto Negroni", description: "Жин, Кампари, улаан вермут, жүржийн хальстай", price: "₮35,000" },
      { image: drink2, name: "Жимсний коктейль", description: "Улирлын жимсний коктейль, наранцацгийн шүүстэй", price: "₮28,000" },
    ],
  },
  {
    key: "wine",
    label: "Дарс",
    items: [
      { image: wine1, name: "Château Margaux 2015", description: "Бордо, Франц — бүрэн биетэй, ягодны амттай улаан дарс", price: "₮320,000" },
      { image: wine2, name: "Chablis Grand Cru", description: "Бургунд, Франц — шинэлэг, минерал амттай цагаан дарс", price: "₮185,000" },
    ],
  },
];

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState("main");
  const activeItems = categories.find((c) => c.key === activeCategory)?.items ?? [];

  return (
    <section id="цэс" className="py-32 px-8 lg:px-16 bg-card">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase text-primary divider-ornament">
            Онцлох цэс
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-8">
            Шилдэг <span className="italic text-primary">амтууд</span>
          </h2>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-6 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`font-sans text-xs md:text-sm tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-300 ${
                activeCategory === cat.key
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {activeItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MenuSection;
