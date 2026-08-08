"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getFeaturedProducts } from "@/data/products";
import { reviews, overallRating, totalReviews, ratingBreakdown } from "@/data/reviews";

export default function Home() {
  const featuredProducts = getFeaturedProducts(4);

  const categories = [
    { name: "Suitings", description: "Premium cut-piece fabrics by the meter", icon: "🧵", href: "/shop?category=Suiting" },
    { name: "Readymade Shirts", description: "Ready-to-wear formal & casual shirts", icon: "👔", href: "/shop?category=Readymade%20Shirt" },
    { name: "Trousers", description: "Slim fit, regular & formal trousers", icon: "👖", href: "/shop?category=Trouser" },
    { name: "Ethnic Wear", description: "Kurtas, pyjamas & festive collections", icon: "🎽", href: "/shop?category=Ethnic" },
  ];

  const ratingBars = [5, 4, 3, 2, 1] as const;

  return (
    <main className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--background-page)" }}>
      <Navbar />
      <Hero />

      {/* Categories Section */}
      <section className="py-20" style={{ backgroundColor: "var(--background-surface)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--accent)" }} />
              <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>What We Offer</span>
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--accent)" }} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: "var(--primary)" }}>
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={cat.href}
                  className="group block rounded-2xl p-6 text-center transition-all duration-300 border hover:-translate-y-1"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "rgba(42, 42, 140, 0.1)",
                  }}
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-black text-sm mb-1.5 transition-colors group-hover:text-[var(--accent)]" style={{ color: "var(--primary)" }}>
                    {cat.name}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {cat.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24" style={{ backgroundColor: "var(--background-page)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--accent)" }} />
                <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>Curated Selection</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: "var(--primary)" }}>
                Featured Arrivals
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-black text-sm uppercase tracking-wider transition-colors border-b-2 pb-1"
              style={{ color: "var(--primary)", borderColor: "var(--primary)" }}
            >
              View All Products →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24" style={{ backgroundColor: "var(--primary)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--accent)" }} />
                <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>Customer Reviews</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: "var(--background-page)" }}>
                What Our Customers Say
              </h2>
            </div>

            {/* Rating Card */}
            <div
              className="shrink-0 rounded-2xl p-5 border border-white/10 min-w-[180px]"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <div className="text-5xl font-black leading-none mb-1" style={{ color: "var(--accent)" }}>
                {overallRating}
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-3.5 h-3.5" fill={s <= Math.round(overallRating) ? "var(--accent)" : "none"} stroke="var(--accent)" strokeWidth="1.5" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-xs" style={{ color: "rgba(253,251,243,0.5)" }}>
                {totalReviews} Google reviews
              </p>
              {/* Rating Bars */}
              <div className="mt-3 space-y-1">
                {ratingBars.map(star => {
                  const pct = ratingBreakdown[star] ?? 0;
                  return (
                    <div key={star} className="flex items-center gap-1.5">
                      <span className="text-[10px] w-3 text-right" style={{ color: "rgba(253,251,243,0.5)" }}>{star}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Review Cards Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.slice(0, 4).map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-2xl p-5 border border-white/10"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shrink-0"
                    style={{ backgroundColor: "var(--accent)", color: "white" }}
                  >
                    {review.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm" style={{ color: "var(--background-page)" }}>{review.name}</span>
                      <span className="text-[10px] shrink-0" style={{ color: "rgba(253,251,243,0.4)" }}>{review.date}</span>
                    </div>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: review.rating }).map((_, s) => (
                        <svg key={s} className="w-3 h-3" fill="var(--accent)" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(253,251,243,0.75)" }}>
                  {review.text}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider text-white" style={{ backgroundColor: "var(--accent)" }}>
              Read All Reviews
            </Link>
            <a
              href="https://maps.app.goo.gl/BcWWSqJxaof9ZfC79"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider border"
              style={{ borderColor: "rgba(253,251,243,0.3)", color: "var(--background-page)" }}
            >
              View on Google Maps →
            </a>
          </div>
        </div>
      </section>

      {/* Store Location */}
      <section className="py-24" style={{ backgroundColor: "var(--background-surface)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--accent)" }} />
                <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>Find Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6" style={{ color: "var(--primary)" }}>
                Visit Our Store
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-primary)" }}>
                Experience the finest quality fabrics and perfectly tailored readymade garments in person. Our experts are ready to assist you at our flagship store in Solapur.
              </p>

              <div className="space-y-5">
                {[
                  { icon: "📍", title: "Address", text: "166, Kanna Chowk, Sakhar Peth,\nBhavani Peth, Solapur – 413002" },
                  { icon: "📞", title: "Phone", text: "+91 8805092070" },
                  { icon: "🕐", title: "Hours", text: "Mon–Sat: 9:00 AM – 9:00 PM\nSunday: 10:00 AM – 7:00 PM" },
                ].map((info) => (
                  <div key={info.title} className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: "var(--primary)", color: "var(--background-page)" }}>
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-black mb-0.5 text-sm" style={{ color: "var(--primary)" }}>{info.title}</h4>
                      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{info.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[420px] w-full rounded-3xl overflow-hidden border-4 shadow-2xl" style={{ borderColor: "var(--primary)" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3801.44299908868!2d75.9189617154238!3d17.67664689912061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc5da89d59e896d%3A0xc0adf7d717d433e2!2sBakale%20nx%20Cut-piece%20%26%20readymade!5e0!3m2!1sen!2sin!4v1691234567890!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0 }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ backgroundColor: "var(--primary-dark)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex flex-col mb-3 gap-1">
                <div className="flex items-center gap-3 bg-white rounded-lg p-2 w-fit shadow-sm">
                  <Image
                    src="/logo-icon.jpg"
                    alt="Bakale Nx Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                  <Image
                    src="/logo-text.jpg"
                    alt="Bakale Nx"
                    width={130}
                    height={44}
                    className="object-contain"
                  />
                </div>
                <div
                  className="text-[10px] tracking-[0.2em] uppercase font-bold pl-2"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Cut-piece & Readymade
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(253,251,243,0.5)" }}>
                Solapur&apos;s premier destination for premium cut-piece fabrics and readymade garments since decades.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-4 text-xs uppercase tracking-wider" style={{ color: "var(--accent)" }}>Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { label: "Home", href: "/" },
                  { label: "Shop All", href: "/shop" },
                  { label: "About Us", href: "/about" },
                  { label: "Cart", href: "/cart" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm transition-colors hover:text-white" style={{ color: "rgba(253,251,243,0.6)" }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-xs uppercase tracking-wider" style={{ color: "var(--accent)" }}>Contact</h4>
              <ul className="space-y-2 text-sm" style={{ color: "rgba(253,251,243,0.6)" }}>
                <li>📍 166, Kanna Chowk, Solapur</li>
                <li><a href="tel:+918805092070" className="hover:text-white transition-colors">📞 +91 8805092070</a></li>
                <li>🕐 Mon–Sat: 9AM–9PM</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t text-center text-xs" style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(253,251,243,0.35)" }}>
            © {new Date().getFullYear()} Bakale Nx Cut-piece & Readymade. All rights reserved. · Solapur, Maharashtra
          </div>
        </div>
      </footer>
    </main>
  );
}
