"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

// Pre-computed particle data to avoid Math.random() on every render
const PARTICLES = [
  { x: 8,  y: 15, size: 2.2, delay: 0.0, dur: 3.8 },
  { x: 22, y: 62, size: 1.6, delay: 0.7, dur: 4.2 },
  { x: 35, y: 28, size: 2.8, delay: 1.4, dur: 3.5 },
  { x: 48, y: 75, size: 1.4, delay: 0.3, dur: 4.6 },
  { x: 61, y: 18, size: 2.0, delay: 1.9, dur: 3.2 },
  { x: 74, y: 55, size: 2.4, delay: 0.9, dur: 4.0 },
  { x: 87, y: 38, size: 1.8, delay: 2.1, dur: 3.7 },
  { x: 14, y: 82, size: 1.2, delay: 1.5, dur: 5.0 },
  { x: 29, y: 44, size: 2.6, delay: 0.6, dur: 3.4 },
  { x: 55, y: 90, size: 1.6, delay: 2.4, dur: 4.3 },
  { x: 68, y: 32, size: 2.0, delay: 1.1, dur: 3.9 },
  { x: 81, y: 68, size: 2.4, delay: 0.4, dur: 4.1 },
  { x: 93, y: 22, size: 1.4, delay: 1.8, dur: 3.6 },
  { x: 42, y: 56, size: 2.8, delay: 2.7, dur: 3.3 },
  { x: 6,  y: 48, size: 1.8, delay: 0.2, dur: 4.8 },
  { x: 77, y: 12, size: 2.2, delay: 1.6, dur: 3.5 },
  { x: 52, y: 35, size: 1.6, delay: 2.9, dur: 4.5 },
  { x: 19, y: 72, size: 2.0, delay: 0.8, dur: 3.8 },
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsExiting(true), 3800);
    const completeTimer = setTimeout(onComplete, 5000);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundImage: 'url("/background/loadingSection.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            overflow: "hidden",
            paddingBottom: "2.5rem",
          }}
        >
          {/* ── Image dark overlay ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(6,4,2,0.72)",
              pointerEvents: "none",
            }}
          />

          {/* ── Atmospheric background glow ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: `
                radial-gradient(ellipse 55% 45% at 18% 28%, rgba(201,164,106,0.07) 0%, transparent 70%),
                radial-gradient(ellipse 45% 55% at 78% 72%, rgba(201,164,106,0.04) 0%, transparent 60%),
                radial-gradient(ellipse 70% 35% at 50% 100%, rgba(201,164,106,0.09) 0%, transparent 50%)
              `,
            }}
          />

          {/* ── Floating particles ── */}
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                backgroundColor: "#C9A46A",
                pointerEvents: "none",
              }}
              animate={{ y: [0, -22, 0], opacity: [0, 0.45, 0], scale: [0.7, 1.3, 0.7] }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}


          {/* ── Bottom UI: ring + text + logo ── */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.9rem",
            }}
          >
            {/* Loading ring */}
            <div style={{ position: "relative", width: 58, height: 58 }}>
              {/* Track */}
              <svg viewBox="0 0 58 58" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <circle cx="29" cy="29" r="25" fill="none" stroke="rgba(201,164,106,0.10)" strokeWidth="1.4" />
              </svg>
              {/* Rotating arc */}
              <motion.svg
                viewBox="0 0 58 58"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
              >
                <defs>
                  <linearGradient id="ls-arcGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%"   stopColor="#F5D78A" />
                    <stop offset="100%" stopColor="rgba(201,164,106,0.15)" />
                  </linearGradient>
                </defs>
                <circle
                  cx="29" cy="29" r="25"
                  fill="none"
                  stroke="url(#ls-arcGrad)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeDasharray="54 104"
                />
              </motion.svg>
              {/* Centre dot */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 3.5, height: 3.5, borderRadius: "50%", backgroundColor: "#C9A46A", opacity: 0.55 }} />
              </div>
            </div>

            {/* Mongolian text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.45, 0.75, 0.45] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.82rem",
                letterSpacing: "0.07em",
                color: "rgba(201,164,106,0.60)",
                textAlign: "center",
                lineHeight: 1.7,
                maxWidth: "290px",
              }}
            >
              Таны туршлагыг гоо сайхан болгохоор
              <br />
              бэлтгэж байна...
            </motion.p>

            {/* GUSTO logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.9 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.18rem", marginTop: "0.3rem" }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.35rem",
                  letterSpacing: "0.5em",
                  color: "#C9A46A",
                  fontWeight: 400,
                  margin: 0,
                  paddingLeft: "0.5em", // visually centre the tracked text
                }}
              >
                GUSTO
              </p>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.28em",
                  color: "rgba(201,164,106,0.38)",
                  fontWeight: 300,
                  margin: 0,
                  paddingLeft: "0.28em",
                }}
              >
                · ITALIAN RESTAURANT ·
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
