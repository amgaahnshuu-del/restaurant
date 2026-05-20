import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import chocolateSouffle from "@/assets/menu-dessert-chocolate-souffle.png";
import beefSkirtRisotto from "@/assets/menu-main-beef-skirt-risotto.png";
import beefFillet from "@/assets/menu-main-beef-fillet.png";
import tomatoConsomme from "@/assets/menu-soup-tomato-consomme.png";
import mangoSoup from "@/assets/menu-soup-mango.png";
import alfredoPasta from "@/assets/menu-pasta-alfredo.png";
import spinachSalad from "@/assets/menu-salad-spinach.png";
import bruschettaMiniPizza from "@/assets/menu-snack-bruschetta-mini-pizza.png";
import { useLanguage } from "@/contexts/LanguageContext";

const MenuSection = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      highlights: [
        { image: chocolateSouffle, name: "Chocolate Souffle", price: "", tag: "Dessert" },
        { image: beefSkirtRisotto, name: "Beef Skirt & Risotto", price: "", tag: "Main course" },
        { image: beefFillet, name: "Beef Fillet", price: "", tag: "Main course" },
        { image: tomatoConsomme, name: "Tomato Consomme", price: "", tag: "Italian soup" },
        { image: mangoSoup, name: "Mango Soup", price: "", tag: "Cream soup" },
        { image: alfredoPasta, name: "Alfredo Pasta", price: "", tag: "Pasta" },
        { image: spinachSalad, name: "Spinach Salad", price: "", tag: "Salad" },
        { image: bruschettaMiniPizza, name: "Bruschetta Mini Pizza", price: "", tag: "Snack" },
      ],
      kicker: "Menu Highlights",
      title1: "Signature plates with",
      title2: "polished pours.",
      body: "A snapshot of the menu built for evenings that deserve something a little more intentional.",
      selected: "Selected",
      selectedHighlight: "Selected highlight",
      cta: "See Full Menu",
    },
    mn: {
      highlights: [
        { image: chocolateSouffle, name: "Chocolate Souffle", price: "", tag: "Дессерт" },
        { image: beefSkirtRisotto, name: "Beef Skirt & Risotto", price: "", tag: "Үндсэн хоол" },
        { image: beefFillet, name: "Beef Fillet", price: "", tag: "Үндсэн хоол" },
        { image: tomatoConsomme, name: "Tomato Consomme", price: "", tag: "Итали шөл" },
        { image: mangoSoup, name: "Mango Soup", price: "", tag: "Крем шөл" },
        { image: alfredoPasta, name: "Alfredo Pasta", price: "", tag: "Паста" },
        { image: spinachSalad, name: "Spinach Salad", price: "", tag: "Салат" },
        { image: bruschettaMiniPizza, name: "Bruschetta Mini Pizza", price: "", tag: "Зууш" },
      ],
      kicker: "Цэсний Онцлох",
      title1: "Онцгой хоолнуудтай",
      title2: "өнгө тансаг ундаа.",
      body: "Илүү утга учиртай үдэш бүрт зориулсан цэсний товч танилцуулга.",
      selected: "Сонгосон",
      selectedHighlight: "Сонгосон онцлох",
      cta: "Бүтэн Цэс Үзэх",
    },
  }[language];

  const [activeHighlight, setActiveHighlight] = useState(copy.highlights[0].name);

  useEffect(() => {
    setActiveHighlight(copy.highlights[0].name);
  }, [language]);

  return (
    <section id="highlights" className="px-6 py-20 lg:px-16">
      <div className="mx-auto max-w-7xl">
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
          <p className="section-description mt-4">{copy.body}</p>
        </motion.div>

        <div className="mx-auto mb-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {copy.highlights.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="h-full"
            >
              <button
                type="button"
                onClick={() => setActiveHighlight(item.name)}
                aria-pressed={activeHighlight === item.name}
                className={`group relative block w-full overflow-hidden rounded-[24px] border bg-white/76 text-left shadow-[0_20px_48px_hsl(28_25%_35%/.08)] transition-all duration-300 dark:bg-white/[0.04] dark:shadow-[0_20px_40px_hsl(0_0%_0%/.2)] ${
                  activeHighlight === item.name
                    ? "border-primary/60 shadow-[0_20px_60px_hsl(40_60%_50%/.18)]"
                    : "border-border/70 hover:border-primary/30 dark:border-white/10"
                }`}
              >
                <div className="relative aspect-[9/16] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(22_28%_16%/.72)] via-[hsl(22_28%_16%/.14)] to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-full border border-white/50 bg-white/78 px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.16em] text-primary/85 backdrop-blur-sm dark:border-white/10 dark:bg-black/35">
                      {item.tag}
                    </span>
                    {activeHighlight === item.name && (
                      <span className="rounded-full border border-primary/30 bg-primary/15 px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
                        {copy.selected}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    {item.price && (
                      <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-primary/85">{item.price}</p>
                    )}
                    <h3 className="mt-2 text-xl text-white drop-shadow-[0_10px_22px_rgba(0,0,0,0.24)]">{item.name}</h3>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mb-10 text-center">
          <p className="font-sans text-[11px] uppercase tracking-[0.24em] text-primary/75">
            {copy.selectedHighlight}
          </p>
          <p className="mt-3 text-2xl text-foreground">
            {copy.highlights.find((item) => item.name === activeHighlight)?.name}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <Link
            to="/menu#full-menu"
            className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-8 py-3.5 font-sans text-[11px] uppercase tracking-[0.26em] text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            {copy.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;
