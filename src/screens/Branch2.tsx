import { motion } from "framer-motion";
import BranchSwitcher from "@/components/BranchSwitcher";
import FooterSection from "@/components/FooterSection";
import gustoLogo from "@/assets/gusto-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Branch2 = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      kicker: "Branch 2",
      body: "Details for Branch 2 will be added soon.",
      sub: "Address and location coming soon...",
    },
    mn: {
      kicker: "Салбар 2",
      body: "Салбар 2-ийн мэдээлэл удахгүй нэмэгдэнэ.",
      sub: "Хаяг, байршил удахгүй...",
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
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.sub}</p>
        </motion.div>
      </section>

      <FooterSection />
    </main>
  );
};

export default Branch2;
