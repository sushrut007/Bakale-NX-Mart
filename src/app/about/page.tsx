"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  const milestones = [
    { year: "1990s", text: "Founded in Bhavani Peth, Solapur — starting with a small fabric counter in Kanna Chowk." },
    { year: "2000s", text: "Became an authorised Raymond dealer — bringing premium suiting fabrics to Solapur." },
    { year: "2010s", text: "Expanded readymade collection; added Gwalior, OCM, and exclusive Bakale Nx branded garments." },
    { year: "Today", text: "Serving thousands of customers with 500+ fabric varieties and a growing online presence." },
  ];

  const values = [
    { icon: "🧵", title: "Quality First", desc: "Every fabric is hand-selected from trusted mills and premium brands for superior quality." },
    { icon: "💰", title: "Fair Pricing", desc: "Competitive prices with no compromise on quality — the same promise since day one." },
    { icon: "🤝", title: "Expert Guidance", desc: "Our experienced staff help you choose the right fabric for every occasion and budget." },
    { icon: "❤️", title: "Community", desc: "Proud to be a part of Solapur's Bhavani Peth community for over three decades." },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--brand-ivory)" }}>
      <Navbar />

      {/* Hero */}
      <section
        className="relative min-h-[60vh] flex items-center pt-24 overflow-hidden"
        style={{ backgroundColor: "var(--brand-maroon)" }}
      >
        {/* Diamond pattern bg */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-8 p-8">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="w-full aspect-square rotate-45 border border-white" />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--brand-red)" }} />
              <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--brand-red)" }}>
                Our Story
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight" style={{ color: "var(--brand-ivory)" }}>
              Crafting Style Since{" "}
              <span style={{ color: "var(--brand-red)" }}>Decades</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: "rgba(253,251,243,0.75)" }}>
              Bakale Nx Cut-piece & Readymade is Solapur's trusted destination for premium
              fabrics and garments, located at the heart of Bhavani Peth since the early 1990s.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ backgroundColor: "var(--brand-blush)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--brand-red)" }} />
              <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--brand-red)" }}>
                What We Stand For
              </span>
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--brand-red)" }} />
            </div>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: "var(--brand-maroon)" }}>
              Our Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6 border"
                style={{
                  backgroundColor: "var(--brand-white)",
                  borderColor: "rgba(59,10,10,0.1)",
                }}
              >
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-black text-base mb-2" style={{ color: "var(--brand-maroon)" }}>
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--brand-warm-grey)" }}>
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20" style={{ backgroundColor: "var(--brand-ivory)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--brand-red)" }} />
              <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--brand-red)" }}>
                Our Journey
              </span>
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--brand-red)" }} />
            </div>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: "var(--brand-maroon)" }}>
              How We Grew
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-5 mb-8"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs shrink-0"
                    style={{ backgroundColor: "var(--brand-maroon)", color: "var(--brand-ivory)" }}
                  >
                    {m.year}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 mt-2" style={{ backgroundColor: "rgba(59,10,10,0.15)" }} />
                  )}
                </div>
                <div className="pb-8">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--brand-near-black)" }}>
                    {m.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Info + Map */}
      <section className="py-20" style={{ backgroundColor: "var(--brand-maroon)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--brand-red)" }} />
                <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--brand-red)" }}>
                  Find Us
                </span>
              </div>
              <h2 className="text-4xl font-black tracking-tight mb-8" style={{ color: "var(--brand-ivory)" }}>
                Visit Our Store
              </h2>

              {[
                { icon: "📍", title: "Address", content: "166, Kanna Chowk, Sakhar Peth,\nBhavani Peth, Solapur – 413002\nMaharashtra, India" },
                { icon: "📞", title: "Phone", content: "+91 8805092070" },
                { icon: "🕐", title: "Business Hours", content: "Monday – Saturday: 9:00 AM – 9:00 PM\nSunday: 10:00 AM – 7:00 PM" },
                { icon: "🌐", title: "Google Maps", content: "maps.app.goo.gl/BcWWSqJxaof9ZfC79" },
              ].map((info) => (
                <div key={info.title} className="flex gap-4 mb-6 items-start">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <p className="font-black text-sm mb-1" style={{ color: "var(--brand-red)" }}>
                      {info.title}
                    </p>
                    {info.title === "Phone" ? (
                      <a
                        href={`tel:${info.content.replace(/\s/g, "")}`}
                        className="text-sm whitespace-pre-line font-bold"
                        style={{ color: "var(--brand-ivory)" }}
                      >
                        {info.content}
                      </a>
                    ) : info.title === "Google Maps" ? (
                      <a
                        href="https://maps.app.goo.gl/BcWWSqJxaof9ZfC79"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline"
                        style={{ color: "rgba(253,251,243,0.7)" }}
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-sm whitespace-pre-line" style={{ color: "rgba(253,251,243,0.75)" }}>
                        {info.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="h-[400px] rounded-3xl overflow-hidden border-4"
              style={{ borderColor: "var(--brand-red)" }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3801.44299908868!2d75.9189617154238!3d17.67664689912061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc5da89d59e896d%3A0xc0adf7d717d433e2!2sBakale%20nx%20Cut-piece%20%26%20readymade!5e0!3m2!1sen!2sin!4v1691234567890!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center" style={{ backgroundColor: "var(--brand-blush)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black mb-4" style={{ color: "var(--brand-maroon)" }}>
            Ready to explore our collection?
          </h2>
          <p className="text-base mb-8" style={{ color: "var(--brand-warm-grey)" }}>
            Browse 30+ premium fabrics and readymade garments
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-black text-sm uppercase tracking-wider text-white"
            style={{ backgroundColor: "var(--brand-red)" }}
          >
            Shop Now
          </Link>
        </div>
      </section>
    </main>
  );
}
