import { motion } from "framer-motion";
import BranchSwitcher from "@/components/BranchSwitcher";
import FooterSection from "@/components/FooterSection";
import gustoLogo from "@/assets/gusto-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Branch1 = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      kicker: "Branch 1",
      body: "A place to experience the art of flavor.",
      location: "Location",
      line1: "Seoul St 48/14, 6th khoroolol",
      line2: "SBD, 4th khoroo, Ulaanbaatar",
    },
    mn: {
      kicker: "Салбар 1",
      body: "Амтны урлагийг мэдрэх газар.",
      location: "Байршил",
      line1: "Seoul St 48/14, 6-р хороолол",
      line2: "СБД, 4-р хороо, Улаанбаатар",
    },
  }[language];

  return (
    <main className="min-h-screen bg-background">
      <BranchSwitcher />
      <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10"
        >
          <span className="mb-6 block font-sans text-xs uppercase tracking-[0.4em] text-primary">{copy.kicker}</span>
          <img src={gustoLogo} alt="Gusto Restaurant" className="mx-auto mb-6 h-44 w-auto md:h-60" />
          <p className="mx-auto mb-4 max-w-lg font-body text-xl tracking-wide text-foreground/60">{copy.body}</p>
          <div className="mt-8 space-y-2">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-primary">{copy.location}</p>
            <p className="font-body text-sm text-foreground/70">{copy.line1}</p>
            <p className="font-body text-sm text-foreground/70">{copy.line2}</p>
          </div>
        </motion.div>
      </section>

      <FooterSection />
    </main>
  );
};

export default Branch1;
