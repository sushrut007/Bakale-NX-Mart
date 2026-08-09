"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Suitings", href: "/shop?category=Suiting" },
    { label: "Readymade", href: "/shop?category=Readymade%20Shirt" },
    { label: "About Us", href: "/about" },
  ];

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: isScrolled ? "1px solid rgba(42, 42, 140, 0.1)" : "1px solid transparent",
        boxShadow: isScrolled ? "0 2px 20px rgba(59,10,10,0.08)" : "none",
        padding: isScrolled ? "6px 0" : "10px 0",
      }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">

        {/* Logo — actual brand image */}
        <Link href="/" className="flex items-center gap-2 z-50 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Image
              src="/logo-icon.jpg"
              alt="Bakale Nx Logo"
              width={52}
              height={52}
              className="object-contain"
              priority
            />
            <div className="hidden sm:block leading-none">
              <Image
                src="/logo-text.jpg"
                alt="Bakale Nx"
                width={120}
                height={40}
                className="object-contain mb-1"
                priority
              />
              <div
                className="text-[9px] tracking-[0.2em] uppercase font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Cut-piece & Readymade
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Link
                href={item.href}
                className="text-sm font-semibold transition-colors duration-200 relative group"
                style={{ color: "var(--primary)" }}
              >
                {item.label}
                <span
                  className="absolute -bottom-0.5 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: "var(--accent)" }}
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Social Icons - Desktop */}
        <div className="hidden lg:flex items-center gap-4 mr-2 border-r pr-6" style={{ borderColor: "rgba(42, 42, 140, 0.1)" }}>
          <a href="https://www.instagram.com/bakalenx?igsh=MWttMnljZjdsejY0OQ==" target="_blank" rel="noopener noreferrer" className="transition-colors hover:-translate-y-0.5 transform" style={{ color: "var(--primary)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z"/></svg>
          </a>
          <a href="https://www.facebook.com/share/1Gx4ES1Dgy/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:-translate-y-0.5 transform" style={{ color: "var(--primary)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
          </a>
          <a href="https://youtube.com/@bakalenx4329?si=cWQgaEVSZhuKmu5j" target="_blank" rel="noopener noreferrer" className="transition-colors hover:-translate-y-0.5 transform" style={{ color: "var(--primary)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
          </a>
        </div>

        {/* Cart + Menu */}
        <div className="flex items-center gap-2 z-50">
          {/* Cart */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openDrawer}
            className="relative p-2.5 rounded-full flex items-center justify-center transition-colors"
            style={{ color: "var(--primary)" }}
            aria-label="Open cart"
          >
            <ShoppingBag size={22} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 text-white text-[10px] flex items-center justify-center rounded-full font-black"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* CTA Button — desktop only */}
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wider text-white transition-all"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Shop Now
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-full transition-colors"
            style={{ color: "var(--primary)" }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
            style={{
              backgroundColor: "#FFFFFF",
              borderTop: "1px solid rgba(42, 42, 140, 0.1)",
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-base font-semibold py-3 px-3 rounded-lg transition-colors"
                  style={{ color: "var(--primary)" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(42, 42, 140, 0.1)" }}>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openDrawer();
                  }}
                  className="flex items-center gap-2 py-3 px-3 rounded-lg font-bold w-full"
                  style={{ color: "var(--accent)" }}
                >
                  <ShoppingBag size={18} />
                  Cart ({totalItems})
                </button>
                <Link
                  href="/shop"
                  className="mt-2 w-full block py-3 rounded-xl font-black text-sm uppercase tracking-wider text-white text-center"
                  style={{ backgroundColor: "var(--accent)" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop Now
                </Link>
                
                {/* Mobile Social Links */}
                <div className="flex items-center justify-center gap-6 mt-6 pb-2">
                  <a href="https://www.instagram.com/bakalenx?igsh=MWttMnljZjdsejY0OQ==" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z"/></svg>
                  </a>
                  <a href="https://www.facebook.com/share/1Gx4ES1Dgy/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </a>
                  <a href="https://youtube.com/@bakalenx4329?si=cWQgaEVSZhuKmu5j" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
