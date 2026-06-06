"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, MapPin, Phone, Mail, User, Heart, Facebook, Instagram, Twitter } from "lucide-react";
import gustoLogo from "@/assets/gusto-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const FooterSection = () => {
  const { language } = useLanguage();
  const copy = {
    en: {
      body: "Gusto is a fine dining destination shaped around warm light, considered service, and menus built for memorable evenings.",
      hours: "Opening Hours",
      contact: "Contact Info",
      account: "My Account",
      admin: "Admin Login",
      newsletter: "Newsletter",
      newsletterPlaceholder: "Your email address",
      subscribe: "Subscribe",
      h1: "Monday - Thursday: 11:00 - 23:00",
      h2: "Friday - Sunday: 10:00 - 00:00",
      address: "Yzguurtan Tsogtsolbor, Ulaanbaatar",
      phone: "+976 77336969",
      email: "info@gusto.mn",
      footer: "Crafted for intimate nights and grand celebrations.",
      social: "Follow Us",
      rights: "All rights reserved.",
    },
    mn: {
      body: "Gusto бол дулаан гэрэл, нямбай үйлчилгээ, дурсамжтай үдэш бүрт зориулсан цэсээрээ ялгардаг итали ресторан юм.",
      hours: "Цагийн Хуваарь",
      contact: "Холбоо Барих",
      account: "Миний бүртгэл",
      admin: "Админ нэвтрэх",
      newsletter: "Мэдээлэл авах",
      newsletterPlaceholder: "Имэйл хаягаа оруулна уу",
      subscribe: "Бүртгүүлэх",
      h1: "Даваа - Пүрэв: 11:00 - 23:00",
      h2: "Баасан - Ням: 10:00 - 00:00",
      address: "Yzguurtan Tsogtsolbor, Улаанбаатар",
      phone: "+976 77336969",
      email: "info@gusto.mn",
      footer: "Дотно орой, томоохон тэмдэглэлт мөчүүдэд зориулав.",
      social: "Бидэнтэй холбогдох",
      rights: "Бүх эрх хуулиар хамгаалагдсан.",
    },
  }[language];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  ];

  return (
    <footer className="relative overflow-hidden border-t-2 border-amber-600/20 dark:border-amber-500/20 bg-gradient-to-b from-white/95 to-white/90 dark:from-black/50 dark:to-black/40 backdrop-blur-sm">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        {/* Main Footer Grid */}
        <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <img src={gustoLogo} alt="Gusto Restaurant" className="h-12 sm:h-14 md:h-16 w-auto" />
            <p className="font-sans text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-sm">
              {copy.body}
            </p>
            
            {/* Social Links */}
            <div className="pt-4">
              <h4 className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-amber-700 dark:text-amber-400 mb-3">
                {copy.social}
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -3, scale: 1.1 }}
                    className="rounded-full border-2 border-amber-600/30 bg-white/80 dark:bg-white/10 p-2 text-amber-700 dark:text-amber-400 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Hours Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <h4 className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-amber-700 dark:text-amber-400 font-semibold">
                {copy.hours}
              </h4>
            </div>
            <div className="space-y-2 font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <p>{copy.h1}</p>
              <p>{copy.h2}</p>
            </div>
            
            {/* Decorative element */}
            <div className="pt-4 hidden sm:block">
              <div className="w-12 h-px bg-gradient-to-r from-amber-600/50 to-transparent" />
            </div>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-amber-600" />
              <h4 className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-amber-700 dark:text-amber-400 font-semibold">
                {copy.contact}
              </h4>
            </div>
            <div className="space-y-3 font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p>{copy.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                <a href={`tel:${copy.phone}`} className="hover:text-amber-600 transition-colors">
                  {copy.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                <a href={`mailto:${copy.email}`} className="hover:text-amber-600 transition-colors">
                  {copy.email}
                </a>
              </div>
            </div>
            
            <div className="pt-2">
              <Link
                to="/account"
                className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
              >
                <User className="h-3 w-3" />
                {copy.account}
              </Link>
            </div>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-amber-600" />
              <h4 className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-amber-700 dark:text-amber-400 font-semibold">
                {copy.newsletter}
              </h4>
            </div>
            <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400">
              Subscribe to receive updates on events and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder={copy.newsletterPlaceholder}
                className="flex-1 rounded-full border-2 border-amber-600/20 bg-white/80 dark:bg-white/10 px-4 py-2 text-xs text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:border-amber-600/50 focus:outline-none transition-colors"
              />
              <button className="rounded-full border-2 border-amber-600/40 bg-amber-600/90 px-4 py-2 font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white hover:bg-amber-700 transition-all duration-300 hover:shadow-lg">
                {copy.subscribe}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t-2 border-amber-600/20 dark:border-amber-500/20"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-500 text-center sm:text-left">
              © 2024 Gusto. {copy.footer}
            </p>
            <p className="font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
              {copy.rights}
            </p>
          </div>
          
          {/* Decorative dots */}
          <div className="flex justify-center gap-1 mt-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-amber-600/30 dark:bg-amber-500/30"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;