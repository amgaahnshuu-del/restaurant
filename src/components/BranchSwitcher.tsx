import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const branches = [
  { path: "/salbar-1", label: "Салбар 1", subtitle: "Удахгүй нэмэгдэнэ" },
  { path: "/salbar-2", label: "Салбар 2", subtitle: "Удахгүй нэмэгдэнэ" },
  { path: "/", label: "Салбар 3", subtitle: "Үндсэн салбар" },
];

const BranchSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-1 sm:gap-2 px-4 py-2">
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mr-2 hidden sm:inline">
          Салбар:
        </span>
        {branches.map((branch) => {
          const isActive = location.pathname === branch.path || 
            (branch.path === "/" && location.pathname === "/");
          return (
            <button
              key={branch.path}
              onClick={() => navigate(branch.path)}
              className={`
                px-3 sm:px-4 py-1.5 rounded-sm font-sans text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-all duration-300
                ${isActive
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                }
              `}
            >
              {branch.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BranchSwitcher;
