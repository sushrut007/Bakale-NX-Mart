"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Diamond } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      style={{ backgroundColor: "var(--brand-maroon)" }}
    >
      {/* Background Image with deep maroon overlay */}
      <div className="absolute inset-0 z-0">
        {/* Gradient overlay — maroon heavy left, fade to transparent right */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(110deg, var(--brand-maroon) 40%, rgba(59,10,10,0.75) 65%, rgba(59,10,10,0.25) 100%)",
          }}
        />
        <img
          src="https://images.unsplash.com/photo-1593030761757-71fae4630c79?q=80&w=2000&auto=format&fit=crop"
          alt="Premium Menswear"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Decorative diamond pattern — top right */}
      <div className="absolute top-24 right-12 z-10 opacity-10 hidden lg:block">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rotate-45 border"
              style={{ borderColor: "var(--brand-red)" }}
            />
          ))}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        style={{ backgroundColor: "var(--brand-red)", opacity: 0.4 }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* Eyebrow tag */}
          <motion.div variants={itemVariants} className="mb-5 flex items-center gap-3">
            <div
              className="w-2 h-2 rotate-45"
              style={{ backgroundColor: "var(--brand-red)" }}
            />
            <span
              className="font-bold tracking-[0.3em] text-xs uppercase"
              style={{ color: "var(--brand-red)" }}
            >
              Established Excellence in Solapur
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]"
            style={{ color: "var(--brand-white)" }}
          >
            Crafting Your{" "}
            <br />
            <span
              style={{
                WebkitTextStroke: "2px var(--brand-red)",
                color: "transparent",
              }}
            >
              Signature
            </span>{" "}
            <span style={{ color: "var(--brand-red)" }}>Style.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl mb-10 max-w-xl leading-relaxed"
            style={{ color: "rgba(253,251,243,0.75)" }}
          >
            Discover our exclusive collection of premium readymade garments,
            exquisite suitings, and fine cut-piece fabrics — featuring top
            brands like Raymond, Gwalior &amp; more.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="group flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white transition-all duration-300 hover:gap-4"
              style={{ backgroundColor: "var(--brand-red)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--brand-red-light)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--brand-red)";
              }}
            >
              Explore Collection
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all duration-300 border-2"
              style={{
                borderColor: "rgba(253,251,243,0.4)",
                color: "var(--brand-ivory)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--brand-ivory)";
                el.style.backgroundColor = "rgba(253,251,243,0.08)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(253,251,243,0.4)";
                el.style.backgroundColor = "transparent";
              }}
            >
              Our Story
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-wrap gap-10"
          >
            {[
              { value: "30+", label: "Years in Business" },
              { value: "500+", label: "Premium Fabrics" },
              { value: "4.6★", label: "Google Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-3xl font-black"
                  style={{ color: "var(--brand-red)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs uppercase tracking-widest mt-1"
                  style={{ color: "rgba(253,251,243,0.6)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "rgba(253,251,243,0.4)" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-12"
          style={{
            background:
              "linear-gradient(to bottom, var(--brand-red), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
