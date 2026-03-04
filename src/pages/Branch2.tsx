import { motion } from "framer-motion";
import BranchSwitcher from "@/components/BranchSwitcher";
import FooterSection from "@/components/FooterSection";
import gustoLogo from "@/assets/gusto-logo.png";

const Branch2 = () => {
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
            ✦ Салбар 2 ✦
          </span>
          <img src={gustoLogo} alt="Gusto Restaurant" className="h-44 md:h-60 w-auto mx-auto mb-6" />
          <p className="font-body text-xl text-foreground/60 max-w-lg mx-auto tracking-wide mb-4">
            Салбар 2-ийн мэдээлэл удахгүй нэмэгдэнэ
          </p>
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Хаяг, байршил удахгүй...
          </p>
        </motion.div>
      </section>

      <FooterSection />
    </main>
  );
};

export default Branch2;
