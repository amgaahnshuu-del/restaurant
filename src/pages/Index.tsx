import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import InteriorSection from "@/components/InteriorSection";
import TeamSection from "@/components/TeamSection";
import MenuSection from "@/components/MenuSection";
import GallerySection from "@/components/GallerySection";
import ReservationSection from "@/components/ReservationSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <main className="bg-background min-h-screen">
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
