import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import InteriorSection from "@/components/InteriorSection";
import TeamSection from "@/components/TeamSection";
import MenuSection from "@/components/MenuSection";
import GallerySection from "@/components/GallerySection";
import ReservationSection from "@/components/ReservationSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";
import BranchSwitcher from "@/components/BranchSwitcher";

const Index = () => {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-orb left-[-4rem] top-40 h-40 w-40 bg-primary/12" />
        <div
          className="ambient-orb right-[-5rem] top-[40rem] h-56 w-56 bg-primary/8"
          style={{ animationDelay: "-5s" }}
        />
        <div className="absolute inset-x-0 top-0 h-[38rem] bg-[linear-gradient(180deg,hsl(40_36%_97%/.56),transparent)] dark:bg-[linear-gradient(180deg,hsl(20_14%_10%/.6),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[42rem] bg-[linear-gradient(180deg,transparent,hsl(32_26%_91%/.7))] dark:bg-[linear-gradient(180deg,transparent,hsl(18_16%_6%/.74))]" />
      </div>
      <BranchSwitcher />
      <HeroSection />
      <AboutSection />
      <InteriorSection />
      <TeamSection />
      <MenuSection />
      <GallerySection />
      <ReservationSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
};

export default Index;
