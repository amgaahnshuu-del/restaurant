import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarCheck,
  Martini,
  Salad,
  Soup,
  Sparkles,
  Utensils,
  Wine,
} from "lucide-react";
import cocktail1 from "@/assets/cocktail-1.jpg";
import cocktail2 from "@/assets/cocktail-2.jpg";
import cocktail3 from "@/assets/cocktail-3.jpg";
import dish4 from "@/assets/dish-4.png";
import dish5 from "@/assets/dish-5.png";
import dish6 from "@/assets/dish-6.png";
import drink1 from "@/assets/drink-1.jpg";
import drink2 from "@/assets/drink-2.jpg";
import gustoLogo from "@/assets/gusto-logo.png";
import menuBeefFillet from "@/assets/menu-main-beef-fillet.png";
import menuBeefRisotto from "@/assets/menu-main-beef-skirt-risotto.png";
import menuBruschetta from "@/assets/menu-snack-bruschetta-mini-pizza.png";
import menuSnackBeefSkirt from "@/assets/menu-snack-beef-skirt.png";
import menuSnackBeefTongue from "@/assets/menu-snack-beef-tongue.png";
import menuSnackChickenLollipop from "@/assets/menu-snack-chicken-lollipop.png";
import menuSnackShellPasta from "@/assets/menu-snack-gusto-in-shell-pasta.png";
import menuChocolateSouffle from "@/assets/menu-dessert-chocolate-souffle.png";
import menuMangoSoup from "@/assets/menu-soup-mango.png";
import menuPastaAlfredo from "@/assets/menu-pasta-alfredo.png";
import menuPastaBeefLasagne from "@/assets/menu-pasta-beef-lasagne.png";
import menuPastaPapardelleOxtail from "@/assets/menu-pasta-papardelle-oxtail-ragout.png";
import menuPastaPenneChiliSausage from "@/assets/menu-pasta-penne-chili-sausage.png";
import menuPastaRavoilliJus from "@/assets/menu-pasta-ravoilli-jus-sauce.png";
import menuPastaRavoilliTomato from "@/assets/menu-pasta-ravoilli-tomato-sauce.png";
import menuPastaSpaghettiCarbonara from "@/assets/menu-pasta-spaghetti-carbonara.png";
import menuPastaTruffleTagliatelle from "@/assets/menu-pasta-truffle-tagliatelle.png";
import menuSaladBurrata from "@/assets/menu-salad-burrata.png";
import menuSaladCaeser from "@/assets/menu-salad-caeser-salad.png";
import menuSaladClottedCreamMousse from "@/assets/menu-salad-clotted-cream-mousse.png";
import menuSaladGreek from "@/assets/menu-salad-greek-salad.png";
import menuSpinachSalad from "@/assets/menu-salad-spinach.png";
import menuSoupBaavarTsai from "@/assets/menu-soup-baavar-tsai.png";
import menuSoupBituuShul from "@/assets/menu-soup-bituu-shul.png";
import menuSoupBroccoli from "@/assets/menu-soup-broccoli-soup.png";
import menuSoupGinger from "@/assets/menu-soup-ginger-soup.png";
import menuSoupPolpette from "@/assets/menu-soup-polpette.png";
import menuSoupPumpkin from "@/assets/menu-soup-pumpkin-soup.png";
import menuSoupTortellini from "@/assets/menu-soup-tortellini-in-brodo.png";
import menuSoupZuppaDiPesce from "@/assets/menu-soup-zuppa-di-pesce.png";
import menuSoupZuppaDiPollo from "@/assets/menu-soup-zuppa-di-pollo.png";
import menuTomatoSoup from "@/assets/menu-soup-tomato-consomme.png";
import menuWarmNorwegianSalmon from "@/assets/menu-warm-appetizer-norwegian-salmon.png";
import menuWarmPoachedEgg from "@/assets/menu-warm-appetizer-poached-egg.png";
import menuWarmRoastedBeef from "@/assets/menu-warm-appetizer-roasted-beef.png";
import wine1 from "@/assets/wine-1.jpg";
import wine2 from "@/assets/wine-2.jpg";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";

type MenuMode = "food" | "drink";
type CategoryId =
  | "signature"
  | "mongolAsia"
  | "mainCourse"
  | "starter"
  | "warmAppetizer"
  | "soup"
  | "salad"
  | "pasta"
  | "dessert"
  | "wine"
  | "cocktail";

type MenuItem = {
  name: string;
  description: string;
  image: string;
  tag: string;
};

type MenuCategory = {
  id: CategoryId;
  mode: MenuMode;
  icon: typeof Utensils;
  items: MenuItem[];
};

const categories: MenuCategory[] = [
  {
    id: "starter",
    mode: "food",
    icon: Sparkles,
    items: [
      {
        name: "Chicken Lollipop",
        description: "French fries and cocktail sauce.",
        image: menuSnackChickenLollipop,
        tag: "Snack",
      },
      {
        name: "Gusto in Shell Pasta",
        description: "Overbaked with bolognese, cheese, cress and pesto sauce.",
        image: menuSnackShellPasta,
        tag: "Snack",
      },
      {
        name: "Beef Skirt",
        description: "French fries, cress, cheese and chimichurri sauce.",
        image: menuSnackBeefSkirt,
        tag: "Snack",
      },
      {
        name: "Beef Tongue",
        description: "Pickled radish, tongue cream, lemon gel, capers, parsley oil, cress and toast bread.",
        image: menuSnackBeefTongue,
        tag: "Snack",
      },
      {
        name: "Bruschetta Mini Pizza",
        description: "Crisp mini pizza style starter from the Gusto food menu.",
        image: menuBruschetta,
        tag: "Snack",
      },
    ],
  },
  {
    id: "salad",
    mode: "food",
    icon: Salad,
    items: [
      {
        name: "Caeser Salad",
        description: "Chicken breast, iceberg, mini tomato, olive cream, toast bread, special sauce foam and parsley oil.",
        image: menuSaladCaeser,
        tag: "Salad",
      },
      {
        name: "Clotted Cream Mousse",
        description: "Yuzu beet cream, mango dressing, orange coulis, parsley oil, basil and farmer bread.",
        image: menuSaladClottedCreamMousse,
        tag: "Cold appetizer",
      },
      {
        name: "Greek Salad",
        description: "Feta, tomato mousse, arugula, spinach, olive, cucumber gel, walnut and balsamico.",
        image: menuSaladGreek,
        tag: "Salad",
      },
      {
        name: "Burrata",
        description: "Arugula, peach, pine nut, prosciutto, balsamico, mini tomato and toast bread.",
        image: menuSaladBurrata,
        tag: "Salad",
      },
      {
        name: "Spinach Salad",
        description: "Spinach salad from the Gusto salad menu.",
        image: menuSpinachSalad,
        tag: "Salad",
      },
    ],
  },
  {
    id: "warmAppetizer",
    mode: "food",
    icon: Sparkles,
    items: [
      {
        name: "Norwegian Salmon",
        description: "Spinach, parsley oil, veloute, hollandaise espuma and cress.",
        image: menuWarmNorwegianSalmon,
        tag: "Warm appetizer",
      },
      {
        name: "Roasted Beef",
        description: "Arugula, tomato sauce, green olive, caper, brioche bread and cress.",
        image: menuWarmRoastedBeef,
        tag: "Warm appetizer",
      },
      {
        name: "Poached Egg",
        description: "Toast bread, passion fruit cream and dressing, pickled radish, cucumber gel and cress.",
        image: menuWarmPoachedEgg,
        tag: "Warm appetizer",
      },
    ],
  },
  {
    id: "pasta",
    mode: "food",
    icon: Utensils,
    items: [
      {
        name: "Penne Pasta Chili Sausage",
        description: "Mini tomato, parmesan, parsley and basil.",
        image: menuPastaPenneChiliSausage,
        tag: "Pasta",
      },
      {
        name: "Truffle Tagliatelle Pasta",
        description: "Shiitake mushroom mousse, spinach, parmesan, cress and parsley oil.",
        image: menuPastaTruffleTagliatelle,
        tag: "Pasta",
      },
      {
        name: "Beef Lasagne",
        description: "Bechamel sauce, garlic and parsley.",
        image: menuPastaBeefLasagne,
        tag: "Pasta",
      },
      {
        name: "Spaghetti Carbonara",
        description: "Bacon, egg sauce, mushroom, black pepper, pesto and parsley.",
        image: menuPastaSpaghettiCarbonara,
        tag: "Pasta",
      },
      {
        name: "Papardelle Oxtail Ragout",
        description: "Parmesan, parsley and gravy sauce.",
        image: menuPastaPapardelleOxtail,
        tag: "Pasta",
      },
      {
        name: "Ravoilli Tomato Sauce",
        description: "Oxtail, saffron dough, cress and tomato sauce.",
        image: menuPastaRavoilliTomato,
        tag: "Pasta",
      },
      {
        name: "Ravoilli Jus Sauce",
        description: "Oxtail, saffron dough, cress and jus sauce.",
        image: menuPastaRavoilliJus,
        tag: "Pasta",
      },
      {
        name: "Alfredo Pasta",
        description: "Creamy Alfredo pasta from the Gusto pasta menu.",
        image: menuPastaAlfredo,
        tag: "Pasta",
      },
    ],
  },
  {
    id: "soup",
    mode: "food",
    icon: Soup,
    items: [
      {
        name: "Mango Soup",
        description: "Mango cream soup from the Gusto soup menu.",
        image: menuMangoSoup,
        tag: "Cream soup",
      },
      {
        name: "Pumpkin Soup",
        description: "Mascarpone, roasted white chocolate and pumpkin seed.",
        image: menuSoupPumpkin,
        tag: "Cream soup",
      },
      {
        name: "Ginger Soup",
        description: "Pickled ginger dice and apple coulis.",
        image: menuSoupGinger,
        tag: "Cream soup",
      },
      {
        name: "Broccoli Soup",
        description: "Spinach, whipped cream and parsley oil.",
        image: menuSoupBroccoli,
        tag: "Cream soup",
      },
      {
        name: "Tomato Consomme",
        description: "Tomato consomme from the Gusto soup menu.",
        image: menuTomatoSoup,
        tag: "Soup",
      },
      {
        name: "Polpette",
        description: "Beef consomme, meatball, bok choy, carrot ball, lemon gel, mini tomato and cress.",
        image: menuSoupPolpette,
        tag: "Italian soup",
      },
      {
        name: "Tortellini in Brodo",
        description: "Oxtail, saffron dough, spinach and parmesan.",
        image: menuSoupTortellini,
        tag: "Italian soup",
      },
      {
        name: "Zuppa di Pollo",
        description: "Spicy chicken bouillabaisse, shiitake, inoki, mini tomato, whipped cream and toast bread.",
        image: menuSoupZuppaDiPollo,
        tag: "Italian soup",
      },
      {
        name: "Zuppa di Pesce",
        description: "Seafood bouillabaisse, bell pepper, pickled ginger, vermicelli tagliati, whipped cream and toast bread.",
        image: menuSoupZuppaDiPesce,
        tag: "Italian soup",
      },
      {
        name: "Baavar Tsai",
        description: "Beef dumpling, dried beef, lamb ribs, rice and fresh milk.",
        image: menuSoupBaavarTsai,
        tag: "Mongolian soup",
      },
      {
        name: "Bituu Shul",
        description: "Mongolian soup with puff pastry.",
        image: menuSoupBituuShul,
        tag: "Mongolian soup",
      },
    ],
  },
  {
    id: "mongolAsia",
    mode: "food",
    icon: Utensils,
    items: [
      {
        name: "Mongolian Asian Plate",
        description: "Mongolian and Asian inspired house plate.",
        image: dish4,
        tag: "Asia Mongolia",
      },
      {
        name: "Wok Style Special",
        description: "Asian style plate with vegetables, protein and house sauce.",
        image: dish5,
        tag: "Asian",
      },
      {
        name: "House Fusion Dish",
        description: "Gusto fusion plate inspired by Mongolian and Asian flavors.",
        image: dish6,
        tag: "Fusion",
      },
    ],
  },
  {
    id: "mainCourse",
    mode: "food",
    icon: Utensils,
    items: [
      {
        name: "Beef Skirt & Risotto",
        description: "Shiitake mushroom risotto, parsley oil, cress, mustard foam, black pepper and sea salt.",
        image: menuBeefRisotto,
        tag: "Main",
      },
      {
        name: "Beef Fillet",
        description: "Carrot cream, pea beans, mushroom, cucumber gel, cress, potato mousseline, milk foam, glazed mini carrot, bok choy and jus.",
        image: menuBeefFillet,
        tag: "Steak",
      },
    ],
  },
  {
    id: "dessert",
    mode: "food",
    icon: Sparkles,
    items: [
      {
        name: "Chocolate Souffle",
        description: "Chocolate souffle from the Gusto dessert menu.",
        image: menuChocolateSouffle,
        tag: "Dessert",
      },
    ],
  },
  {
    id: "wine",
    mode: "drink",
    icon: Wine,
    items: [
      {
        name: "Red Wine Selection",
        description: "Full-bodied pours chosen for pasta, steak and long evenings.",
        image: wine1,
        tag: "Wine",
      },
      {
        name: "White Wine Selection",
        description: "Fresh, bright wines for starters, seafood and lighter plates.",
        image: wine2,
        tag: "Wine",
      },
      {
        name: "Dinner Pairing",
        description: "Ask the team for a bottle matched to your selected dishes.",
        image: drink1,
        tag: "Pairing",
      },
    ],
  },
  {
    id: "cocktail",
    mode: "drink",
    icon: Martini,
    items: [
      {
        name: "Signature Cocktail",
        description: "Balanced house cocktail with a clean aromatic finish.",
        image: cocktail1,
        tag: "Cocktail",
      },
      {
        name: "Classic Cocktail",
        description: "A polished bar classic prepared for dinner service.",
        image: cocktail2,
        tag: "Bar",
      },
      {
        name: "Non-Alcoholic Drink",
        description: "Refreshing zero-proof drink with fruit and soft botanicals.",
        image: cocktail3,
        tag: "Zero proof",
      },
      {
        name: "Soft Beverage",
        description: "Simple chilled drink options for every table.",
        image: drink2,
        tag: "Drink",
      },
    ],
  },
];

const Menu = () => {
  const { language } = useLanguage();
  const [mode, setMode] = useState<MenuMode>("food");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("starter");

  const copy = {
    en: {
      back: "Home",
      reserve: "Reserve",
      kicker: "Gusto Menu",
      title: "Choose by category, not by PDF.",
      body: "A visual menu built from the restaurant menu images. Browse food and drinks faster, then open the original PDF only when you need it.",
      eyebrow: "Italian dining in Ulaanbaatar",
      modes: {
        food: "Food",
        drink: "Drinks",
      },
      categories: {
        signature: "Featured",
        mongolAsia: "Asia Mongolia",
        mainCourse: "Main Course",
        starter: "Snack",
        warmAppetizer: "Warm Appetizer",
        soup: "Soups",
        salad: "Salads",
        pasta: "Pasta",
        dessert: "Desserts",
        wine: "Wine",
        cocktail: "Cocktails",
      },
      categoryNotes: {
        signature: "Main dishes and chef selections",
        mongolAsia: "Mongolian and Asian inspired dishes",
        mainCourse: "Full dinner plates and hearty mains",
        starter: "Snack plates and small bites",
        warmAppetizer: "Warm appetizers will be added here",
        soup: "Warm and creamy bowls",
        salad: "Fresh lighter plates",
        pasta: "Comforting Italian pasta",
        dessert: "Sweet final courses",
        wine: "Wine and pairings",
        cocktail: "Cocktails and beverages",
      },
      showing: "Showing",
    },
    mn: {
      back: "Нүүр",
      reserve: "Захиалга",
      kicker: "Gusto цэс",
      title: "PDF биш, ангиллаар нь тухтай үзээрэй.",
      body: "Рестораны цэсний зургуудыг ашиглаад хоол, уух зүйлсийг ангиллаар нь хурдан харах web menu болголоо. Хэрэгтэй үед эх PDF-ээ нээж болно.",
      eyebrow: "Улаанбаатар дахь итали ресторан",
      modes: {
        food: "Хоол",
        drink: "Уух зүйлс",
      },
      categories: {
        signature: "Хамгийн эх",
        mongolAsia: "Ази Монгол",
        mainCourse: "Үндсэн хоол",
        starter: "Зууш",
        soup: "Шөл",
        salad: "Салат",
        pasta: "Паста",
        dessert: "Амттан",
        wine: "Дарс",
        cocktail: "Коктейль",
      },
      categoryNotes: {
        signature: "Үндсэн хоол болон chef selection",
        mongolAsia: "Монгол болон Ази хэв маягийн хоолнууд",
        mainCourse: "Өег, бүрэн үндсэн хоолны сонголтууд",
        starter: "Хоолны өмнөх жижиг таваг",
        soup: "Дулаан, кремлэг шөл",
        salad: "Хөнгөн, шинэхэн сонголт",
        pasta: "Итали паста",
        dessert: "Оройн хоолны амттан",
        wine: "Дарс болон pairing",
        cocktail: "Коктейль, ундаа",
      },
      showing: "Харагдаж байна",
    },
  }[language];

  const visibleCategories = useMemo(() => categories.filter((category) => category.mode === mode), [mode]);
  const selectedCategory = visibleCategories.find((category) => category.id === activeCategory) ?? visibleCategories[0];
  const ActiveIcon = selectedCategory.icon;
  const getCategoryLabel = (id: CategoryId) =>
    copy.categories[id as keyof typeof copy.categories] ??
    (id === "warmAppetizer" ? (language === "mn" ? "Бүлээн зууш" : "Warm Appetizer") : id);
  const getCategoryNote = (id: CategoryId) =>
    copy.categoryNotes[id as keyof typeof copy.categoryNotes] ??
    (id === "warmAppetizer"
      ? language === "mn"
        ? "Бүлээн зуушнууд энд нэмэгдэнэ"
        : "Warm appetizers will be added here"
      : "");

  const setActiveMode = (nextMode: MenuMode) => {
    setMode(nextMode);
    setActiveCategory(categories.find((category) => category.mode === nextMode)?.id ?? "signature");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,hsl(40_34%_96%),hsl(34_30%_91%)_48%,hsl(28_26%_88%))] dark:bg-[linear-gradient(120deg,hsl(20_16%_8%),hsl(22_14%_10%)_52%,hsl(18_18%_6%))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,hsl(38_56%_46%/.08)_1px,transparent_1px),linear-gradient(180deg,hsl(38_56%_46%/.06)_1px,transparent_1px)] bg-[size:56px_56px] opacity-35 dark:opacity-20" />

      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 border-b border-border/60 bg-background/82 backdrop-blur-2xl dark:border-white/10"
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group inline-flex h-10 items-center gap-2 rounded-full border border-border/75 bg-white/65 px-3 font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-all hover:border-primary/45 hover:text-primary dark:border-white/10 dark:bg-white/[0.05]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{copy.back}</span>
          </Link>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <img src={gustoLogo} alt="Gusto" className="h-9 w-auto sm:h-10" />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              to="/#reservation"
              className="hidden h-10 items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 font-sans text-[11px] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:inline-flex"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              {copy.reserve}
            </Link>
          </div>
        </div>
      </motion.header>

      <section id="full-menu" className="relative z-10 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1450px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-[18px] border border-white/70 bg-white/72 px-4 py-3 shadow-[0_14px_42px_hsl(28_25%_35%/.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_14px_42px_hsl(0_0%_0%/.26)] sm:px-5 lg:px-6 lg:py-3.5"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold-gradient" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(38_56%_46%/.1),transparent_30%),linear-gradient(315deg,hsl(10_34%_32%/.08),transparent_36%)]" />

            <div className="relative grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-primary/80">
                  {copy.kicker}
                </p>
                <p className="mt-1.5 font-sans text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  {copy.eyebrow}
                </p>
                <h1 className="mt-1.5 max-w-3xl text-2xl font-light leading-[1.08] text-foreground sm:text-3xl lg:text-4xl">
                  {copy.title}
                </h1>
                <p className="mt-2 max-w-2xl font-sans text-xs leading-5 text-muted-foreground">
                  {copy.body}
                </p>
              </div>

              <div className="w-full lg:w-auto">
                <div className="relative grid rounded-full border border-primary/20 bg-[linear-gradient(180deg,hsl(22_18%_14%/.05),hsl(38_56%_46%/.08))] p-1 shadow-[inset_0_1px_0_hsl(0_0%_100%/.35),0_16px_36px_hsl(28_25%_20%/.1)] dark:border-primary/25 dark:bg-[linear-gradient(180deg,hsl(20_14%_7%),hsl(24_18%_10%))] dark:shadow-[inset_0_1px_0_hsl(0_0%_100%/.06),0_18px_44px_hsl(0_0%_0%/.28)] sm:grid-cols-2 lg:min-w-[360px]">
                  {(["food", "drink"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setActiveMode(item)}
                      className={`relative flex h-10 items-center justify-center gap-2 rounded-full px-4 font-sans text-[10px] uppercase tracking-[0.18em] transition-all ${
                        mode === item
                          ? "bg-gold-gradient text-primary-foreground shadow-[0_12px_28px_hsl(38_56%_46%/.28)]"
                          : "text-muted-foreground hover:bg-white/55 hover:text-foreground dark:hover:bg-white/[0.06]"
                      }`}
                    >
                      {item === "food" ? <Utensils className="h-3.5 w-3.5" /> : <Wine className="h-3.5 w-3.5" />}
                      {copy.modes[item]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-5 flex gap-2 overflow-x-auto rounded-[22px] bg-[linear-gradient(180deg,hsl(22_20%_12%/.06),hsl(34_26%_22%/.04))] p-1.5 dark:bg-[linear-gradient(180deg,hsl(20_16%_7%/.92),hsl(24_18%_9%/.82))]">
            {visibleCategories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory.id === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex h-11 min-w-fit items-center gap-2 rounded-full border px-5 font-sans text-[11px] uppercase tracking-[0.18em] transition-all ${
                    isActive
                      ? "border-primary/70 bg-gold-gradient text-primary-foreground shadow-[0_14px_34px_hsl(38_56%_46%/.28)]"
                      : "border-border/70 bg-white/58 text-muted-foreground shadow-[inset_0_1px_0_hsl(0_0%_100%/.38)] hover:border-primary/35 hover:bg-white/82 hover:text-primary dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[inset_0_1px_0_hsl(0_0%_100%/.06)] dark:hover:bg-white/[0.08]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {getCategoryLabel(category.id)}
                </button>
              );
            })}
          </div>

          <motion.section
            key={selectedCategory.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-4 overflow-hidden rounded-[28px] border border-white/75 bg-white/68 shadow-[0_34px_100px_hsl(28_25%_35%/.15)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_34px_100px_hsl(0_0%_0%/.4)]"
          >
            <div className="flex flex-col gap-4 border-b border-white/70 bg-white/50 px-5 py-5 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between lg:px-7">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/12 text-primary">
                  <ActiveIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                    {copy.showing}
                  </p>
                  <h2 className="mt-1 font-display text-3xl font-light text-foreground">
                    {getCategoryLabel(selectedCategory.id)}
                  </h2>
                </div>
              </div>
              <p className="max-w-md font-sans text-sm leading-6 text-muted-foreground">
                {getCategoryNote(selectedCategory.id)}
              </p>
            </div>

            <div className="grid gap-4 bg-[radial-gradient(circle_at_50%_0%,hsl(38_56%_46%/.12),transparent_34%),linear-gradient(180deg,hsl(34_28%_91%/.92),hsl(31_24%_86%/.92))] p-4 dark:bg-[radial-gradient(circle_at_50%_0%,hsl(38_56%_46%/.12),transparent_34%),linear-gradient(180deg,hsl(20_14%_8%),hsl(18_16%_4%))] sm:grid-cols-2 sm:p-5 lg:grid-cols-3 lg:p-7">
              {selectedCategory.items.map((item, index) => (
                <motion.article
                  key={item.name}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="group overflow-hidden rounded-[22px] border border-white/80 bg-white shadow-[0_22px_60px_hsl(28_25%_35%/.12)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/[0.06]"
                >
                    <div className="relative aspect-[9/16] overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/45 bg-white/82 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.16em] text-primary backdrop-blur dark:border-white/10 dark:bg-black/40">
                      {item.tag}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-2xl font-light text-foreground">{item.name}</h3>
                    <p className="mt-3 font-sans text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        </div>
      </section>
    </main>
  );
};

export default Menu;
