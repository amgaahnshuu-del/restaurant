import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ChefHat, Star } from "lucide-react";
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
        { image: chocolateSouffle, name: "Chocolate Souffle", price: "$18", tag: "Dessert", description: "Warm chocolate with vanilla bean ice cream" },
        { image: beefSkirtRisotto, name: "Beef Skirt & Risotto", price: "$42", tag: "Main course", description: "Slow-cooked beef, truffle risotto, parmesan" },
        { image: beefFillet, name: "Beef Fillet", price: "$58", tag: "Main course", description: "Grass-fed beef, red wine reduction, seasonal vegetables" },
        { image: tomatoConsomme, name: "Tomato Consomme", price: "$16", tag: "Italian soup", description: "Clear tomato broth, basil oil, croutons" },
        { image: mangoSoup, name: "Mango Soup", price: "$14", tag: "Cream soup", description: "Chilled mango cream, coconut foam, lime zest" },
        { image: alfredoPasta, name: "Alfredo Pasta", price: "$28", tag: "Pasta", description: "Fettuccine, parmesan cream, black pepper" },
        { image: spinachSalad, name: "Spinach Salad", price: "$16", tag: "Salad", description: "Baby spinach, walnuts, goat cheese, berry vinaigrette" },
        { image: bruschettaMiniPizza, name: "Bruschetta Mini Pizza", price: "$14", tag: "Snack", description: "Toasted bread, fresh tomatoes, basil, garlic" },
      ],
      kicker: "Menu Highlights",
      title1: "Signature plates with",
      title2: "polished pours.",
      body: "A snapshot of the menu built for evenings that deserve something a little more intentional.",
      selected: "Selected",
      selectedHighlight: "Featured Dish",
      cta: "Explore Full Menu",
    },
    mn: {
      highlights: [
        { image: chocolateSouffle, name: "Chocolate Souffle", price: "$18", tag: "Дессерт", description: "Ванилийн зайрмагтай халуун шоколад" },
        { image: beefSkirtRisotto, name: "Beef Skirt & Risotto", price: "$42", tag: "Үндсэн хоол", description: "Удаан чанасан үхрийн мах, трюфель рисотто, пармезан" },
        { image: beefFillet, name: "Beef Fillet", price: "$58", tag: "Үндсэн хоол", description: "Өвсөөр тэжээгдсэн үхрийн мах, улаан дарсны соус, улирлын ногоо" },
        { image: tomatoConsomme, name: "Tomato Consomme", price: "$16", tag: "Итали шөл", description: "Тунгалаг улаан лоолийн шөл, яншуйн тос, крутон" },
        { image: mangoSoup, name: "Mango Soup", price: "$14", tag: "Крем шөл", description: "Хөргөсөн манго крем, кокосны хөөс, шохойн хальс" },
        { image: alfredoPasta, name: "Alfredo Pasta", price: "$28", tag: "Паста", description: "Феттучини, пармезан крем, хар перц" },
        { image: spinachSalad, name: "Spinach Salad", price: "$16", tag: "Салат", description: "Бууцай, хушга, ямааны бяслаг, жимсний венигрет" },
        { image: bruschettaMiniPizza, name: "Bruschetta Mini Pizza", price: "$14", tag: "Зууш", description: "Шарсан талх, шинэ улаан лооль, яншуй, сармис" },
      ],
      kicker: "Цэсний Онцлох",
      title1: "Онцгой хоолнуудтай",
      title2: "өнгө тансаг ундаа.",
      body: "Илүү утга учиртай үдэш бүрт зориулсан цэсний товч танилцуулга.",
      selected: "Сонгосон",
      selectedHighlight: "Онцлох хоол",
      cta: "Бүтэн Цэс Үзэх",
    },
  }[language];

  const [activeHighlight, setActiveHighlight] = useState(copy.highlights[0].name);

  useEffect(() => {
    setActiveHighlight(copy.highlights[0].name);
  }, [language]);

  const activeItem = copy.highlights.find((item) => item.name === activeHighlight);

  return (
    <section id="highlights" className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/30 to-transparent dark:via-amber-950/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-10 sm:mb-12 md:mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/20 bg-white/90 dark:bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 backdrop-blur-sm">
            <ChefHat className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
            <span className="font-sans text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-amber-700 dark:text-amber-400">
              {copy.kicker}
            </span>
          </div>
          
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] sm:leading-[1.05] md:leading-[0.95] tracking-tight">
            {copy.title1}
            <span className="italic text-amber-700 dark:text-amber-500"> {copy.title2}</span>
          </h2>
          
          <p className="max-w-2xl mx-auto mt-3 sm:mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans tracking-wide">
            {copy.body}
          </p>
        </motion.div>

        {/* Menu Grid */}
        <div className="mx-auto mb-10 sm:mb-12 md:mb-16 grid gap-4 sm:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                className={`group relative block w-full overflow-hidden rounded-xl sm:rounded-2xl border-2 bg-white/90 dark:bg-black/40 text-left backdrop-blur-md shadow-lg transition-all duration-300 ${
                  activeHighlight === item.name
                    ? "border-amber-600/60 dark:border-amber-500/60 shadow-2xl shadow-amber-600/20"
                    : "border-amber-600/20 dark:border-amber-500/20 hover:border-amber-600/40 dark:hover:border-amber-500/40"
                }`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Tags */}
                  <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full border border-amber-600/30 bg-amber-600/90 backdrop-blur-sm px-2 py-1 font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-white shadow-lg">
                      {item.tag}
                    </span>
                    {activeHighlight === item.name && (
                      <span className="rounded-full border border-amber-400/30 bg-amber-500/90 backdrop-blur-sm px-2 py-1 font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-white shadow-lg flex items-center gap-1">
                        <Star className="h-2 w-2 fill-white" />
                        {copy.selected}
                      </span>
                    )}
                  </div>
                  
                  {/* Price & Name */}
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    {item.price && (
                      <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-amber-300 font-semibold">
                        {item.price}
                      </p>
                    )}
                    <h3 className="mt-1 text-sm sm:text-base md:text-lg font-medium text-white drop-shadow-lg line-clamp-1">
                      {item.name}
                    </h3>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Selected Highlight Details */}
        <motion.div
          key={activeHighlight}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 sm:mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/20 bg-white/90 dark:bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
            <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              {copy.selectedHighlight}
            </span>
          </div>
          
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-neutral-800 dark:text-neutral-100 mb-2">
            {activeItem?.name}
          </h3>
          
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            {activeItem?.description}
          </p>
          
          {activeItem?.price && (
            <p className="mt-3 font-sans text-lg sm:text-xl text-amber-700 dark:text-amber-400 font-semibold">
              {activeItem.price}
            </p>
          )}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <Link
            to="/menu#full-menu"
            className="group inline-flex items-center gap-2 sm:gap-3 rounded-full border-2 border-amber-600/40 dark:border-amber-500/40 bg-white/90 dark:bg-white/10 px-6 sm:px-8 py-3 sm:py-3.5 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.26em] text-amber-700 dark:text-amber-400 backdrop-blur-sm shadow-lg transition-all duration-300 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-500 hover:border-amber-600 hover:shadow-xl"
          >
            {copy.cta}
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;