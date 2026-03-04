import { motion } from "framer-motion";
import BranchSwitcher from "@/components/BranchSwitcher";
import FooterSection from "@/components/FooterSection";
import gustoLogo from "@/assets/gusto-logo.png";

const Branch1 = () => {
  return (
    <main className="bg-background min-h-screen">
      <BranchSwitcher />
      
      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10"
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase text-primary mb-6 block">
            ✦ Салбар 1 ✦
          </span>
          <img src={gustoLogo} alt="Gusto Restaurant" className="h-28 md:h-40 w-auto mx-auto mb-6" />
          <p className="font-body text-xl text-foreground/60 max-w-lg mx-auto tracking-wide mb-4">
            Амтны урлагийг мэдрэх газар
          </p>
          <div className="mt-8 space-y-2">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-primary">
              📍 Байршил
            </p>
            <p className="font-body text-sm text-foreground/70">
              Seoul St 48/14, 6-р хороолол
            </p>
            <p className="font-body text-sm text-foreground/70">
              СБД — 4-р хороо, Улаанбаатар
            </p>
          </div>
        </motion.div>
      </section>

      <FooterSection />
    </main>
  );
};

export default Branch1;
