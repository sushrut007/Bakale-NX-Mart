"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { CheckCircle2, ChevronRight, Phone, MapPin, Clock } from "lucide-react";

export default function AboutPage() {
  const familyLegacy = [
    {
      name: "Shri Girish G. Bakale",
      phone: "8805092070",
      title: "Bakale NX Cutpiece & Readymade",
      desc: "Authorized Dealer – Raymond, Aditya Birla, Ruby Linen, Siyaram & Premium Men's Fashion Brands",
      icon: "👔",
    },
    {
      name: "Shri Nitin G. Bakale",
      phone: "9423588895",
      title: "Bakale Enterprise",
      desc: "Specializing in Garment Manufacturing and Production",
      icon: "🏭",
    },
    {
      name: "Shri Sandeep G. Bakale",
      phone: "9423588897",
      title: "Bakale Brothers",
      desc: "Garment Manufacturing and Textile Operations",
      icon: "🏭",
    },
    {
      name: "Dr. Rohit G. Bakale",
      phone: "+91 9960077217",
      title: "Bakale Dental Clinic",
      desc: "Providing Professional Dental Care and Healthcare Services",
      icon: "🦷",
    },
  ];

  const whatWeOffer = [
    "Premium Men's Suiting & Shirting Fabrics",
    "Cutpiece Materials in Various Designs & Price Ranges",
    "Readymade Shirts, Trousers, Blazers & Ethnic Wear",
    "Tailoring & Garment Manufacturing Support for Retailers & Boutiques",
    "Trusted Brands Including Raymond, Linen, Siyaram, Ramraj and More",
  ];

  const whyChooseUs = [
    "55 Years of Trust & Excellence",
    "Founded by Late Shri Govind Bakale",
    "Led by Shri Girish G. Bakale",
    "Authorized Raymond Dealer",
    "Premium Brands Under One Roof",
    "Thousands of Satisfied Customers",
    "Quality, Style & Value at Competitive Prices",
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--background-page)" }}>
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative min-h-[70vh] flex items-center pt-24 pb-12 overflow-hidden"
        style={{ backgroundColor: "var(--primary)" }}
      >
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-8 p-8">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="w-full aspect-square rotate-45 border border-white" />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--accent)" }} />
                <span className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>
                  Since 1970
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6" style={{ color: "var(--background-page)" }}>
                55 Years of Style, Quality & <span style={{ color: "var(--accent)" }}>Trust</span>
              </h1>
              <div className="space-y-4 text-base md:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
                <p>
                  The legacy of Bakale NX Cutpiece & Readymade was founded by Late Shri Govind Bakale, whose dedication, honesty, and commitment to customer satisfaction laid the foundation for a trusted family business that has proudly served Solapur for over 55 years.
                </p>
                <p>
                  Today, this legacy is carried forward by Shri Girish G. Bakale, continuing the tradition of delivering premium fabrics, quality garments, and exceptional customer service to generations of families.
                </p>
                <p>
                  As an Authorized Raymond Dealer, Bakale NX offers an extensive collection of premium suiting and shirting fabrics, cutpiece materials, readymade garments, ethnic wear, and tailoring solutions, making it one of Solapur&apos;s most trusted destinations for men&apos;s fashion.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden border-4 shadow-2xl mx-auto lg:ml-auto max-w-md w-full"
              style={{ borderColor: "var(--accent)" }}
            >
              <Image
                src="/ceo-girish-bakale.jpg"
                alt="Shri Girish G. Bakale"
                width={600}
                height={800}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-2xl font-black text-white mb-1">Shri Girish G. Bakale</h3>
                <p className="text-sm text-white/80 font-bold uppercase tracking-wider">Carrying Forward The Legacy</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Bakale Family Legacy */}
      <section className="py-20 md:py-28" style={{ backgroundColor: "var(--background-surface)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4" style={{ color: "var(--primary)" }}>
              The Bakale Family Legacy
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              The Bakale family has successfully expanded its commitment to quality and service across multiple business sectors:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {familyLegacy.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 border hover:shadow-lg transition-shadow flex flex-col h-full"
                style={{ borderColor: "var(--border-default)" }}
              >
                <div className="text-4xl mb-4">{member.icon}</div>
                <h3 className="text-xl font-black mb-1" style={{ color: "var(--primary)" }}>{member.name}</h3>
                <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="text-sm font-bold flex items-center gap-2 mb-4 hover:underline" style={{ color: "var(--accent)" }}>
                  <Phone size={14} /> {member.phone}
                </a>
                <div className="mt-auto pt-4 border-t" style={{ borderColor: "var(--border-default)" }}>
                  <h4 className="font-bold text-sm mb-2" style={{ color: "var(--text-primary)" }}>{member.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{member.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer & Why Choose Us */}
      <section className="py-20 md:py-28" style={{ backgroundColor: "var(--background-page)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* What We Offer */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--accent)" }} />
                <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: "var(--primary)" }}>
                  What We Offer
                </h2>
              </div>
              <ul className="space-y-4">
                {whatWeOffer.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="shrink-0 mt-1" size={24} style={{ color: "var(--semantic-success)" }} />
                    <span className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Why Choose Us */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl p-8 md:p-10"
              style={{ backgroundColor: "var(--background-surface-alt)" }}
            >
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8" style={{ color: "var(--primary)" }}>
                Why Choose Bakale NX
              </h2>
              <ul className="space-y-4">
                {whyChooseUs.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <ChevronRight className="shrink-0" size={20} style={{ color: "var(--accent)" }} />
                    <span className="text-base md:text-lg font-bold" style={{ color: "var(--text-primary)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 md:py-28 text-center" style={{ backgroundColor: "var(--primary-dark)" }}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] mb-6" style={{ color: "var(--accent)" }}>
            Our Vision
          </h2>
          <p className="text-2xl md:text-4xl font-medium leading-relaxed italic" style={{ color: "var(--background-page)" }}>
            &quot;To continue the legacy established by Late Shri Govind Bakale by providing premium-quality fabrics, exceptional customer service, and trusted fashion solutions while strengthening the Bakale family&apos;s reputation for excellence across generations.&quot;
          </p>
        </div>
      </section>

      {/* Visit Us / Map */}
      <section className="py-20 md:py-28" style={{ backgroundColor: "var(--background-surface)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: "var(--primary)" }}>
                Visit Us
              </h2>
              <p className="text-xl font-bold mb-8" style={{ color: "var(--accent)" }}>
                &quot;55 Years of Style, Quality & Trust&quot;
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--primary-tint)" }}>
                    <MapPin size={24} style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>Address</h3>
                    <p className="text-base" style={{ color: "var(--text-secondary)" }}>
                      Near Padma Talkies, Kanna Chowk,<br />
                      Solapur – 413005
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--primary-tint)" }}>
                    <Phone size={24} style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>Phone</h3>
                    <a href="tel:8805092070" className="text-base font-bold hover:underline block mb-3" style={{ color: "var(--accent)" }}>
                      88050 92070
                    </a>
                    <div className="flex items-center gap-4">
                      <a href="https://www.instagram.com/bakalenx?igsh=MWttMnljZjdsejY0OQ==" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: "var(--primary)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z"/></svg>
                      </a>
                      <a href="https://www.facebook.com/share/1Gx4ES1Dgy/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: "var(--primary)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                      </a>
                      <a href="https://youtube.com/@bakalenx4329?si=cWQgaEVSZhuKmu5j" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: "var(--primary)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="inline-block px-6 py-3 rounded-full font-bold text-sm tracking-wide" style={{ backgroundColor: "var(--primary)", color: "white" }}>
                ✨ A Proud Legacy of the Bakale Family Since 1970 👔
              </div>
            </div>

            <div
              className="h-[450px] rounded-3xl overflow-hidden border-4 shadow-xl"
              style={{ borderColor: "var(--accent)" }}
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
      <section className="py-16 text-center" style={{ backgroundColor: "var(--background-page)" }}>
        <div className="container mx-auto px-4 md:px-6 border-t pt-16" style={{ borderColor: "var(--border-default)" }}>
          <h2 className="text-3xl font-black mb-4" style={{ color: "var(--primary)" }}>
            Ready to explore our collection?
          </h2>
          <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
            Browse premium fabrics and readymade garments online
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-black text-sm uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Shop Now
          </Link>
        </div>
      </section>
    </main>
  );
}
