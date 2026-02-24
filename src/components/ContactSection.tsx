import { motion } from "framer-motion";
import exterior1 from "@/assets/exterior-1.jpg";
import exterior2 from "@/assets/exterior-2.jpg";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="холбоо" className="py-32 px-8 lg:px-16 bg-card">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-sans text-xs tracking-[0.4em] uppercase text-primary divider-ornament">
            Холбоо барих
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mt-8">
            Бидэнтэй <span className="italic text-primary">холбогдох</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-foreground mb-2">Хаяг</h4>
                <p className="font-body text-muted-foreground">
                  Улаанбаатар хот, Сүхбаатар дүүрэг,<br />
                  Энхтайвны өргөн чөлөө 15
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-foreground mb-2">Утас</h4>
                <p className="font-body text-muted-foreground">+976 7700 1234</p>
                <p className="font-body text-muted-foreground">+976 9911 5678</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-foreground mb-2">Имэйл</h4>
                <p className="font-body text-muted-foreground">info@gusto.mn</p>
                <p className="font-body text-muted-foreground">reservation@gusto.mn</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-foreground mb-2">Цагийн хуваарь</h4>
                <p className="font-body text-muted-foreground">Даваа – Баасан: 11:00 – 23:00</p>
                <p className="font-body text-muted-foreground">Бямба – Ням: 10:00 – 00:00</p>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2673.8!2d106.9177!3d47.9185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDU1JzA2LjYiTiAxMDbCsDU1JzAzLjciRQ!5e0!3m2!1sen!2smn!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 350 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Gusto ресторан байршил"
              className="grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </div>

        {/* Exterior Photos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-primary text-center mb-8">
            Гаднаас харагдах байдал
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="overflow-hidden group">
              <img
                src={exterior1}
                alt="Gusto рестораны гадна талын харагдах байдал"
                className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden group">
              <img
                src={exterior2}
                alt="Gusto рестораны гадна терас"
                className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
