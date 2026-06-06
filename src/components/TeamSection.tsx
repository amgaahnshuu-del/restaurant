import { motion } from "framer-motion";
import chef2 from "@/assets/chef-2.jpg";
import chef3 from "@/assets/chef-3.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Award, Wine, Coffee } from "lucide-react";

const team = [
  { 
    image: "/chef/huslen.jpg", 
    name: "Б. Батболд", 
    nameEn: "B. Batbold",
    role: "Ерөнхий тогооч", 
    roleEn: "Executive Chef",
    desc: "15 жилийн олон улсын туршлагатай, Франц, Японд суралцсан",
    descEn: "15 years of international experience, trained in France and Japan",
    icon: Award
  },
  { 
    image: chef2, 
    name: "О. Сарангэрэл", 
    nameEn: "O. Sarangerel",
    role: "Дэд тогооч", 
    roleEn: "Pastry Chef",
    desc: "Амттан болон зуушны мэргэжилтэн, Италид мэргэшсэн",
    descEn: "Pastry and dessert specialist, specialized in Italy",
    icon: Coffee
  },
  { 
    image: chef3, 
    name: "Д. Ганбаатар", 
    nameEn: "D. Ganbaatar",
    role: "Сомелье", 
    roleEn: "Sommelier",
    desc: "Дэлхийн 500+ дарсны мэдлэгтэй, WSET сертификаттай",
    descEn: "Knowledge of 500+ wines from around the world, WSET certified",
    icon: Wine
  },
];

const TeamSection = () => {
  const { language } = useLanguage();
  
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-transparent to-amber-50/20 dark:from-amber-950/10 dark:via-transparent dark:to-amber-950/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/20 bg-white/90 dark:bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
            <span className="font-sans text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-amber-700 dark:text-amber-400">
              {language === 'en' ? 'Our Team' : 'Манай баг'}
            </span>
          </div>
          
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] sm:leading-[1.05] md:leading-[0.95] tracking-tight">
            {language === 'en' ? 'Exceptional' : 'Шилдэг'}
            <span className="italic text-amber-700 dark:text-amber-500">
              {' '}{language === 'en' ? 'Experts' : 'мэргэжилтнүүд'}
            </span>
          </h2>
          
          <p className="max-w-2xl mx-auto mt-3 sm:mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans tracking-wide">
            {language === 'en' 
              ? 'Meet the passionate individuals who bring Gusto to life' 
              : 'Gusto-д амь шингээдэг хүсэл тэмүүлэлтэй хүмүүстэй танилцана уу'}
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              className="group rounded-2xl sm:rounded-3xl border-2 border-amber-600/20 dark:border-amber-500/20 bg-white/90 dark:bg-black/40 backdrop-blur-md shadow-xl hover:border-amber-600/40 dark:hover:border-amber-500/40 hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-gradient-to-b from-amber-100/20 to-transparent dark:from-amber-900/20">
                <div className="relative w-full aspect-square">
                  <img
                    src={member.image}
                    alt={language === 'en' ? member.nameEn : member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon Badge */}
                  <div className="absolute bottom-4 right-4 bg-amber-600/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <member.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5 sm:p-6 text-center">
                <h3 className="text-xl sm:text-2xl font-medium text-neutral-800 dark:text-neutral-100 mb-1">
                  {language === 'en' ? member.nameEn : member.name}
                </h3>
                
                <span className="inline-block font-sans text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 mb-3">
                  {language === 'en' ? member.roleEn : member.role}
                </span>
                
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {language === 'en' ? member.descEn : member.desc}
                </p>
                
                {/* Decorative Line */}
                <div className="mt-4 pt-4 border-t border-amber-600/20 dark:border-amber-500/20">
                  <div className="flex justify-center gap-1">
                    {[...Array(3)].map((_, idx) => (
                      <div
                        key={idx}
                        className="w-1 h-1 rounded-full bg-amber-600/40 dark:bg-amber-500/40"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 rounded-2xl border-2 border-amber-600/30 dark:border-amber-500/30 bg-white/90 dark:bg-white/10 px-6 sm:px-8 py-4 sm:py-5 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
                {language === 'en' ? 'Michelin Star Experience' : 'Мишлен Оддын Туршлага'}
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-amber-600/30" />
            <div className="flex items-center gap-2">
              <Wine className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
                {language === 'en' ? 'Award Winning Team' : 'Шагналт Баг'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;