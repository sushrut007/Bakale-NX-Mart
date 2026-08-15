"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Share2, Ruler, ArrowLeft, Heart, Check, Star, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { getProductById, getRelatedProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = getProductById(id);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [length, setLength] = useState<number>(1.5);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center" style={{ backgroundColor: "var(--background-page)" }}>
        <Navbar />
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4" style={{ color: "var(--primary)" }}>Product Not Found</h1>
          <Link href="/shop" className="px-8 py-4 rounded-full font-black text-white text-sm" style={{ backgroundColor: "var(--accent)" }}>
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const related = getRelatedProducts(product, 4);
  const images = product.images ?? [product.image];

  const handleAddToCart = () => {
    if (product.isCutPiece) {
      addItem(product, qty, undefined, length);
    } else {
      addItem(product, qty, selectedSize ?? "M");
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const totalLinePrice = product.isCutPiece
    ? product.price * length * qty
    : product.price * qty;

  return (
    <main
      className="min-h-screen flex flex-col pt-24"
      style={{ backgroundColor: "var(--background-page)" }}
    >
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b py-3" style={{ borderColor: "rgba(42, 42, 140, 0.1)", backgroundColor: "#FFFFFF" }}>
        <div className="container mx-auto px-4 md:px-6 flex items-center gap-2 text-sm flex-wrap">
          <Link href="/" className="flex items-center gap-1 transition-colors" style={{ color: "var(--text-secondary)" }}>
            <ArrowLeft size={14} /> Home
          </Link>
          <span style={{ color: "var(--text-secondary)" }}>/</span>
          <Link href="/shop" style={{ color: "var(--text-secondary)" }}>Shop</Link>
          <span style={{ color: "var(--text-secondary)" }}>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} style={{ color: "var(--text-secondary)" }}>
            {product.category}
          </Link>
          <span style={{ color: "var(--text-secondary)" }}>/</span>
          <span className="font-semibold line-clamp-1" style={{ color: "var(--primary)" }}>{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div
              className="rounded-3xl overflow-hidden aspect-[4/5] relative border-4"
              style={{ borderColor: "var(--primary)", backgroundColor: "var(--background-surface)" }}
            >
              <img 
                src={images[activeImg]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all" 
                onError={(e) => { 
                  e.currentTarget.src = "/logo-icon.jpg";
                  e.currentTarget.classList.remove("object-cover");
                  e.currentTarget.classList.add("object-contain", "p-12", "opacity-50");
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{ backgroundColor: "var(--primary)", color: "var(--background-page)" }}>
                  {product.category}
                </span>
              </div>
              {product.isNew && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{ backgroundColor: "var(--accent)", color: "white" }}>
                    New
                  </span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className="w-20 h-20 rounded-xl overflow-hidden border-2 transition-all"
                    style={{
                      borderColor: activeImg === idx ? "var(--accent)" : "rgba(59,10,10,0.15)",
                      opacity: activeImg === idx ? 1 : 0.6,
                    }}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-cover transition-all" 
                      onError={(e) => { 
                        e.currentTarget.src = "/logo-icon.jpg";
                        e.currentTarget.classList.remove("object-cover");
                        e.currentTarget.classList.add("object-contain", "p-3", "opacity-50");
                      }} 
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="text-xs font-black uppercase tracking-[0.25em] mb-2" style={{ color: "var(--accent)" }}>
              {product.brand}
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight" style={{ color: "var(--primary)" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= Math.round(product.rating) ? "var(--accent)" : "none"}
                    stroke="var(--accent)"
                  />
                ))}
              </div>
              <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>{product.rating}</span>
              <span className="text-sm underline cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                {product.reviewCount} reviews
              </span>
            </div>

            {/* Price */}
            <div className="text-4xl font-black mb-2" style={{ color: "var(--primary)" }}>
              ₹{product.price.toLocaleString("en-IN")}
              {product.isCutPiece && <span className="text-lg font-normal ml-2" style={{ color: "var(--text-secondary)" }}>/ meter</span>}
              {product.originalPrice && (
                <span className="ml-3 text-lg font-normal line-through" style={{ color: "var(--text-secondary)" }}>
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {!product.inStock && (
              <div className="mb-4 px-4 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor: "rgba(238,27,27,0.1)", color: "var(--accent)" }}>
                ⚠️ Currently Out of Stock
              </div>
            )}

            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-primary)" }}>
              {product.description}
            </p>

            <div className="h-px mb-6" style={{ backgroundColor: "rgba(42, 42, 140, 0.1)" }} />

            {/* Size / Length */}
            <div className="mb-6">
              {product.isCutPiece ? (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm" style={{ color: "var(--primary)" }}>Required Length (Meters)</span>
                    <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                      <Ruler size={14} /> Calculator
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={length}
                      onChange={(e) => setLength(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                      className="w-24 p-3 border-2 rounded-xl text-center font-bold transition-colors focus:outline-none"
                      style={{ borderColor: "var(--primary)", color: "var(--primary)", backgroundColor: "#FFFFFF" }}
                    />
                    <span style={{ color: "var(--text-secondary)" }}>meters</span>
                    <span className="font-black text-lg ml-auto" style={{ color: "var(--accent)" }}>
                      = ₹{(product.price * length).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm" style={{ color: "var(--primary)" }}>Select Size</span>
                    <button onClick={() => setIsSizeChartOpen(true)} className="text-xs font-bold uppercase tracking-wider hover:underline" style={{ color: "var(--accent)" }}>Size Guide</button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(product.availableSizes ?? ["S", "M", "L", "XL", "XXL"]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className="min-w-12 h-12 px-3 rounded-xl font-bold text-sm transition-all border-2"
                        style={{
                          backgroundColor: selectedSize === size ? "var(--primary)" : "#FFFFFF",
                          color: selectedSize === size ? "var(--background-page)" : "var(--primary)",
                          borderColor: selectedSize === size ? "var(--primary)" : "rgba(59,10,10,0.2)",
                          transform: selectedSize === size ? "scale(1.1)" : "scale(1)",
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Qty + Actions */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <div className="flex items-center border-2 rounded-xl overflow-hidden" style={{ borderColor: "rgba(59,10,10,0.2)" }}>
                <button className="px-4 py-3 font-bold text-lg" style={{ color: "var(--primary)" }} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="px-4 font-bold" style={{ color: "var(--primary)" }}>{qty}</span>
                <button className="px-4 py-3 font-bold text-lg" style={{ color: "var(--primary)" }} onClick={() => setQty(qty + 1)}>+</button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: addedToCart ? "var(--primary)" : "var(--accent)",
                  color: "white",
                  boxShadow: product.inStock ? "0 8px 24px rgba(238,27,27,0.35)" : "none",
                }}
              >
                {addedToCart ? <><Check size={18} />Added! ₹{totalLinePrice.toLocaleString("en-IN")}</> : <><ShoppingCart size={18} />Add to Cart</>}
              </button>

              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor: wishlisted ? "var(--accent)" : "rgba(59,10,10,0.2)",
                  backgroundColor: wishlisted ? "rgba(238,27,27,0.08)" : "#FFFFFF",
                  color: wishlisted ? "var(--accent)" : "var(--primary)",
                }}
              >
                <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
              </button>

              <button
                className="w-12 h-12 rounded-xl border-2 flex items-center justify-center"
                style={{ borderColor: "rgba(59,10,10,0.2)", color: "var(--primary)", backgroundColor: "#FFFFFF" }}
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Social Sharing */}
            <div className="flex items-center gap-4 mb-8 pt-4 border-t" style={{ borderColor: "rgba(42, 42, 140, 0.1)" }}>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Share this product:</span>
              <div className="flex items-center gap-2">
                <a href="#" className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all" style={{ borderColor: "rgba(59,10,10,0.1)", color: "#25D366", backgroundColor: "#FFFFFF" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(37,211,102,0.1)" }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all" style={{ borderColor: "rgba(59,10,10,0.1)", color: "#1877F2", backgroundColor: "#FFFFFF" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(24,119,242,0.1)" }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all" style={{ borderColor: "rgba(59,10,10,0.1)", color: "#000000", backgroundColor: "#FFFFFF" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.1)" }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                </a>
              </div>
            </div>

            {/* Features */}
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: "var(--background-surface)", borderColor: "rgba(42, 42, 140, 0.1)" }}>
              <h3 className="font-black text-sm uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Product Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-primary)" }}>
                    <div className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ backgroundColor: "var(--accent)" }} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--accent)" }} />
              <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>You May Also Like</span>
            </div>
            <h2 className="text-3xl font-black mb-8" style={{ color: "var(--primary)" }}>Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p.id} {...p} />)}
            </div>
          </div>
        )}
      </div>
      {/* Size Chart Modal */}
      <AnimatePresence>
        {isSizeChartOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute inset-0 backdrop-blur-sm"
              style={{ backgroundColor: "rgba(29, 29, 102, 0.4)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl z-10"
              style={{ backgroundColor: "var(--background-page)" }}
            >
              <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black" style={{ color: "var(--primary)" }}>Size Guide</h2>
                  <button onClick={() => setIsSizeChartOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100">
                    <X size={20} style={{ color: "var(--primary)" }} />
                  </button>
                </div>
                
                <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "rgba(42, 42, 140, 0.1)" }}>
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase" style={{ backgroundColor: "var(--primary)", color: "white" }}>
                      <tr>
                        <th className="px-6 py-4 font-bold rounded-tl-xl">Size</th>
                        <th className="px-6 py-4 font-bold">Chest (in)</th>
                        <th className="px-6 py-4 font-bold">Length (in)</th>
                        <th className="px-6 py-4 font-bold rounded-tr-xl">Shoulder (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['S', 'M', 'L', 'XL', 'XXL'].map((sz, i) => (
                        <tr key={sz} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"} style={{ color: "var(--text-primary)" }}>
                          <td className="px-6 py-4 font-bold border-b border-gray-100">{sz}</td>
                          <td className="px-6 py-4 border-b border-gray-100">{38 + (i * 2)}</td>
                          <td className="px-6 py-4 border-b border-gray-100">{28 + (i * 0.5)}</td>
                          <td className="px-6 py-4 border-b border-gray-100">{17.5 + (i * 0.5)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs mt-4" style={{ color: "var(--text-secondary)" }}>
                  * Measurements shown are standard and may vary slightly depending on the fit (Slim vs Regular).
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
