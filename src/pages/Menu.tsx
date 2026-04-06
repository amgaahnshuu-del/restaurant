import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import gustoLogo from "@/assets/gusto-logo.png";
import signatureDish1 from "@/assets/signature-dish-1.jpg";
import signatureDish2 from "@/assets/signature-dish-2.jpg";
import signatureDish3 from "@/assets/signature-dish-3.jpg";
import cocktail1 from "@/assets/cocktail-1.jpg";
import cocktail2 from "@/assets/cocktail-2.jpg";
import cocktail3 from "@/assets/cocktail-3.jpg";
import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";
import dish4 from "@/assets/dish-4.png";
import dish5 from "@/assets/dish-5.png";
import dish6 from "@/assets/dish-6.png";
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
    key: "snack",
    label: "Snack",
    items: [
      { image: appetizer1, name: "Брускетта", description: "Италийн прошутто, инжир, зөгийн бал, рикотта бяслагтай", price: "₮45,000" },
    ],
  },
  {
    key: "cold-appetizer",
    label: "Cold Appetizer & Salad",
    items: [
      { image: appetizer2, name: "Тунаг загас", description: "Шинэхэн тунаг загас, авокадо, васаби соустой", price: "₮55,000" },
    ],
  },
  {
    key: "soup",
    label: "Soup",
    items: [
      { image: dish1, name: "Шарсан фуа гра", description: "Чимэглэлтэй", price: "₮000" },
    ],
  },
  {
    key: "italian-soup",
    label: "Italian Soup",
    items: [
      { image: dish4, name: "Минестроне", description: "Италийн уламжлалт ногооны шөл, пармезан бяслагтай", price: "₮38,000" },
    ],
  },
  {
    key: "mongolian-soup",
    label: "Mongolian Soup",
    items: [
      { image: dish3, name: "Монгол шөл", description: "Үхрийн махтай уламжлалт монгол шөл", price: "₮32,000" },
    ],
  },
  {
    key: "asia-mongolia",
    label: "Asia & Mongolia",
    items: [
      { image: dish6, name: "Мөөгний ризотто", description: "Мөөгний ризотто, пармезан бяслаг, трюфель тостой", price: "₮78,000" },
    ],
  },
  {
    key: "main-course",
    label: "Main Course",
    items: [
      { image: dish5, name: "Шарсан салмон", description: "Шарсан салмон филе, сарнайн цөцгийн тос, аспарагустай", price: "₮98,000" },
      { image: dish2, name: "Вагью үхрийн мах", description: "А5 зэрэглэлийн вагью үхрийн мах, трюфель соустой", price: "₮145,000" },
    ],
  },
  {
    key: "share-food",
    label: "Share Food",
    items: [
      { image: dessert1, name: "Ваниль крем брюле", description: "Классик ваниль крем брюле, улирлын жимстэй", price: "₮42,000" },
      { image: dessert2, name: "Тирамису", description: "Италийн уламжлалт тирамису, маскарпоне бяслагтай", price: "₮48,000" },
    ],
  },
];

const signatureItems = [
  { image: signatureDish1, name: "Вагью Стейк", description: "Алтан хальстай А5 зэрэглэлийн вагью, трюфель соустой", price: "₮145,000" },
  { image: signatureDish2, name: "Шарсан Салмон", description: "Шинэхэн салмон филе, аспарагус, лимонтой цөцгийн тос", price: "₮98,000" },
  { image: signatureDish3, name: "Мөөгний Ризотто", description: "Трюфель, пармезан бяслаг, шинэхэн мөөгтэй", price: "₮78,000" },
];

const cocktailItems = [
  { image: cocktail1, name: "Old Fashioned", description: "Bourbon, ангостура биттер, элсэн чихэр, жүржийн хальс", price: "₮28,000" },
  { image: cocktail2, name: "Espresso Martini", description: "Водка, кофейн ликёр, шинэхэн эспрессо", price: "₮32,000" },
  { image: cocktail3, name: "Negroni", description: "Жин, кампари, сладкий вермут, жүржийн зүсэм", price: "₮30,000" },
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("snack");
  const activeItems = categories.find((c) => c.key === activeCategory)?.items ?? [];

  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground group-hover:text-primary transition-colors">
              ← Нүүр
            </span>
          </Link>
          <Link to="/">
            <img src={gustoLogo} alt="Gusto" className="h-10 w-auto" />
          </Link>
          <Link
            to="/#захиалга"
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-primary hover:text-foreground transition-colors"
          >
            Захиалга →
          </Link>
        </div>
      </motion.header>

      {/* Hero — Signature Dishes */}
      <section className="pt-28 pb-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <span className="font-sans text-[11px] tracking-[0.4em] uppercase text-primary/70">
              ✦ Онцлох ✦
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-foreground mt-6">
              Гол <span className="italic text-primary">хоолнууд</span>
            </h1>
          </motion.div>

          {/* 3 Signature Dishes — Large Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {signatureItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.15 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-xl aspect-[3/4]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    width={800}
                    height={1024}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-primary/80 block mb-2">
                      {item.price}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="font-body text-sm text-white/60 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cocktails Section */}
      <section className="py-24 px-6 lg:px-16 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="font-sans text-[11px] tracking-[0.4em] uppercase text-primary/70">
              ✦ Коктейль ✦
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-6">
              Онцгой <span className="italic text-primary">коктейлнууд</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {cocktailItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl aspect-square mb-5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    width={800}
                    height={1024}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-3">
                    <span className="h-px flex-1 max-w-16 bg-white/[0.08]" />
                    <span className="font-sans text-[11px] tracking-[0.2em] text-primary font-medium">
                      {item.price}
                    </span>
                    <span className="h-px flex-1 max-w-16 bg-white/[0.08]" />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-1.5">
                    {item.name}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Menu with Tabs */}
      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="font-sans text-[11px] tracking-[0.4em] uppercase text-primary/70">
              ✦ Бүрэн цэс ✦
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-6">
              Бүх <span className="italic text-primary">амтууд</span>
            </h2>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-16">
            {categories.map((cat) => (
              <motion.button
                key={cat.key}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat.key)}
                className={`font-sans text-[10px] md:text-[11px] tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border transition-all duration-300 ${
                  activeCategory === cat.key
                    ? "border-primary text-primary bg-primary/10 shadow-md shadow-primary/10"
                    : "border-white/[0.08] text-muted-foreground/70 hover:text-foreground hover:border-white/[0.15] hover:bg-white/[0.03]"
                }`}
              >
                {cat.label}
              </motion.button>
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
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {activeItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-xl mb-5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <span className="h-px flex-1 max-w-12 bg-white/[0.08]" />
                      <span className="font-sans text-[11px] tracking-[0.2em] text-primary font-medium">
                        {item.price}
                      </span>
                      <span className="h-px flex-1 max-w-12 bg-white/[0.08]" />
                    </div>
                    <h3 className="font-display text-xl text-foreground mb-1.5">
                      {item.name}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground/60 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 text-center border-t border-white/[0.06]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-lg text-muted-foreground/60 mb-6">
            Амтны аяллаа эхлүүлэхэд бэлэн үү?
          </p>
          <Link
            to="/#захиалга"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-full px-10 py-4 font-sans text-[11px] tracking-[0.25em] uppercase text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            Ширээ захиалах
            <span>→</span>
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default Menu;
