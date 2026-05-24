import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copy = {
    en: {
      light: "Light",
      dark: "Dark",
      toggle: "Toggle theme",
    },
    mn: {
      light: "Light",
      dark: "Dark",
      toggle: "Theme solih",
    },
  }[language];

  const activeTheme = mounted ? theme : "light";
  const isDark = activeTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={copy.toggle}
      className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/80 px-3 py-2 font-sans text-[10px] uppercase tracking-[0.22em] text-foreground shadow-[0_12px_30px_hsl(28_25%_35%/.08)] transition-all duration-300 hover:border-primary/25 hover:text-primary dark:border-white/10 dark:bg-white/10 dark:text-white dark:shadow-[0_14px_35px_hsl(0_0%_0%/.28)] dark:hover:border-primary/35"
    >
      {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      <span>{isDark ? copy.light : copy.dark}</span>
    </button>
  );
};

export default ThemeToggle;
