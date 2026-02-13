import { motion } from "framer-motion";

const ReservationSection = () => {
  return (
    <section id="захиалга" className="py-32 px-8 lg:px-16">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase text-primary divider-ornament">
            Захиалга
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-8 mb-6">
            Ширээ <span className="italic text-primary">захиалах</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto mb-12">
            Бид таныг хүлээн авахад бэлэн. Манай зочдын мартагдашгүй
            орой болохыг баталгаажуулна.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Нэр"
              className="w-full bg-transparent border border-border px-6 py-4 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
            <input
              type="tel"
              placeholder="Утасны дугаар"
              className="w-full bg-transparent border border-border px-6 py-4 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="date"
              className="w-full bg-transparent border border-border px-6 py-4 font-body text-foreground focus:border-primary focus:outline-none transition-colors"
            />
            <select className="w-full bg-transparent border border-border px-6 py-4 font-body text-foreground focus:border-primary focus:outline-none transition-colors appearance-none">
              <option value="" className="bg-card">Зочдын тоо</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n} className="bg-card">
                  {n} хүн
                </option>
              ))}
            </select>
          </div>
          <button className="w-full bg-gold-gradient px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase text-primary-foreground hover:opacity-90 transition-opacity duration-300">
            Захиалга илгээх
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ReservationSection;
