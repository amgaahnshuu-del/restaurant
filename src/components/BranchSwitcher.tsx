import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const BranchSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const copy = {
    en: {
      label: "Locations",
      branches: [
        { path: "/salbar-1", label: "Branch 1" },
        { path: "/salbar-2", label: "Branch 2" },
        { path: "/", label: "Flagship" },
      ],
    },
    mn: {
      label: "Салбарууд",
      branches: [
        { path: "/salbar-1", label: "Салбар 1" },
        { path: "/salbar-2", label: "Салбар 2" },
        { path: "/", label: "Үндсэн салбар" },
      ],
    },
  }[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-background/88 shadow-[0_14px_45px_hsl(28_25%_35%/.08)] backdrop-blur-xl dark:border-white/5 dark:shadow-[0_18px_45px_hsl(0_0%_0%/.28)]"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="hidden font-sans text-[10px] uppercase tracking-[0.24em] text-muted-foreground/60 lg:inline">
            {copy.label}
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 pr-1 sm:pb-0">
            {copy.branches.map((branch) => {
              const isActive = location.pathname === branch.path || (branch.path === "/" && location.pathname === "/");

              return (
                <button
                  key={branch.path}
                  onClick={() => navigate(branch.path)}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-2 font-sans text-[9px] uppercase tracking-[0.14em] transition-all duration-300 sm:px-4 sm:text-[11px] sm:tracking-[0.18em] ${
                    isActive
                      ? "border-primary/30 bg-primary/10 text-primary shadow-[0_10px_24px_hsl(38_56%_46%/.12)]"
                      : "border-border/50 bg-white/70 text-muted-foreground hover:border-primary/20 hover:bg-white hover:text-foreground dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/15 dark:hover:bg-white/[0.08] dark:hover:text-white"
                  }`}
                >
                  {branch.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </motion.div>
  );
};

export default BranchSwitcher;
