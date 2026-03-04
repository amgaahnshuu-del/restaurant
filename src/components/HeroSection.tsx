import { motion } from "framer-motion";
import heroImage from "@/assets/hero-restaurant.jpg";
import gustoLogo from "@/assets/gusto-logo.png";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Elegant fine dining restaurant interior"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex items-center justify-between px-8 py-6 lg:px-16"
      >
        <span className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Est. 2024
        </span>
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Тухай", href: "#тухай" },
            { label: "Цэс", href: "#цэс" },
            { label: "Галерей", href: "#галерей" },
            { label: "Захиалга", href: "#захиалга" },
            { label: "Холбоо барих", href: "#холбоо" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-sans text-xs tracking-[0.2em] uppercase text-foreground/70 hover:text-primary transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>
        <span className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Улаанбаатар
        </span>
      </motion.nav>

      {/* Hero Content */}
      <div className="relative z-10 flex h-[calc(100vh-88px)] flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mb-6"
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase text-primary">
            ✦ Дээд зэргийн амталгаа ✦
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mb-6"
        >
          <img src={gustoLogo} alt="Gusto Restaurant" className="h-48 md:h-64 lg:h-80 w-auto mx-auto" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="font-body text-xl md:text-2xl text-foreground/60 max-w-lg tracking-wide"
        >
          Амтны урлагийг мэдрэх газар
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mt-12"
        >
          <a
            href="#захиалга"
            className="group inline-flex items-center gap-3 border border-primary/30 px-8 py-3 font-sans text-xs tracking-[0.2em] uppercase text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
          >
            Ширээ захиалах
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
