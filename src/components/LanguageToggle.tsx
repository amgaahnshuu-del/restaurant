import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-border/80 bg-white/80 p-1 shadow-[0_12px_30px_hsl(28_25%_35%/.08)] dark:border-white/10 dark:bg-white/10 dark:shadow-[0_14px_35px_hsl(0_0%_0%/.28)]">
      {[
        { key: "en", label: "EN" },
        { key: "mn", label: "MN" },
      ].map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => setLanguage(item.key as "en" | "mn")}
          className={`rounded-full px-2.5 py-1.5 font-sans text-[9px] uppercase tracking-[0.16em] transition-all duration-300 sm:px-3 sm:text-[11px] sm:tracking-[0.22em] ${
            language === item.key
              ? "bg-primary text-primary-foreground shadow-[0_10px_20px_hsl(38_56%_46%/.22)]"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground dark:hover:bg-white/10 dark:hover:text-white"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
