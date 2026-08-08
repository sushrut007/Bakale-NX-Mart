"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Share2, Ruler, ArrowLeft, Heart, Check, Star } from "lucide-react";
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

  if (!product) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center" style={{ backgroundColor: "var(--brand-ivory)" }}>
        <Navbar />
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4" style={{ color: "var(--brand-maroon)" }}>Product Not Found</h1>
          <Link href="/shop" className="px-8 py-4 rounded-full font-black text-white text-sm" style={{ backgroundColor: "var(--brand-red)" }}>
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
      style={{ backgroundColor: "var(--brand-ivory)" }}
    >
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b py-3" style={{ borderColor: "rgba(59,10,10,0.1)", backgroundColor: "var(--brand-white)" }}>
        <div className="container mx-auto px-4 md:px-6 flex items-center gap-2 text-sm flex-wrap">
          <Link href="/" className="flex items-center gap-1 transition-colors" style={{ color: "var(--brand-warm-grey)" }}>
            <ArrowLeft size={14} /> Home
          </Link>
          <span style={{ color: "var(--brand-warm-grey)" }}>/</span>
          <Link href="/shop" style={{ color: "var(--brand-warm-grey)" }}>Shop</Link>
          <span style={{ color: "var(--brand-warm-grey)" }}>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} style={{ color: "var(--brand-warm-grey)" }}>
            {product.category}
          </Link>
          <span style={{ color: "var(--brand-warm-grey)" }}>/</span>
          <span className="font-semibold line-clamp-1" style={{ color: "var(--brand-maroon)" }}>{product.name}</span>
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
              style={{ borderColor: "var(--brand-maroon)", backgroundColor: "var(--brand-blush)" }}
            >
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{ backgroundColor: "var(--brand-maroon)", color: "var(--brand-ivory)" }}>
                  {product.category}
                </span>
              </div>
              {product.isNew && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{ backgroundColor: "var(--brand-red)", color: "white" }}>
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
                      borderColor: activeImg === idx ? "var(--brand-red)" : "rgba(59,10,10,0.15)",
                      opacity: activeImg === idx ? 1 : 0.6,
                    }}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.currentTarget.src = "/logo.png" }} 
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
            <div className="text-xs font-black uppercase tracking-[0.25em] mb-2" style={{ color: "var(--brand-red)" }}>
              {product.brand}
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight" style={{ color: "var(--brand-maroon)" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= Math.round(product.rating) ? "var(--brand-red)" : "none"}
                    stroke="var(--brand-red)"
                  />
                ))}
              </div>
              <span className="text-sm font-bold" style={{ color: "var(--brand-maroon)" }}>{product.rating}</span>
              <span className="text-sm underline cursor-pointer" style={{ color: "var(--brand-warm-grey)" }}>
                {product.reviewCount} reviews
              </span>
            </div>

            {/* Price */}
            <div className="text-4xl font-black mb-2" style={{ color: "var(--brand-maroon)" }}>
              ₹{product.price.toLocaleString("en-IN")}
              {product.isCutPiece && <span className="text-lg font-normal ml-2" style={{ color: "var(--brand-warm-grey)" }}>/ meter</span>}
              {product.originalPrice && (
                <span className="ml-3 text-lg font-normal line-through" style={{ color: "var(--brand-warm-grey)" }}>
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {!product.inStock && (
              <div className="mb-4 px-4 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor: "rgba(238,27,27,0.1)", color: "var(--brand-red)" }}>
                ⚠️ Currently Out of Stock
              </div>
            )}

            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--brand-near-black)" }}>
              {product.description}
            </p>

            <div className="h-px mb-6" style={{ backgroundColor: "rgba(59,10,10,0.1)" }} />

            {/* Size / Length */}
            <div className="mb-6">
              {product.isCutPiece ? (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm" style={{ color: "var(--brand-maroon)" }}>Required Length (Meters)</span>
                    <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--brand-red)" }}>
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
                      style={{ borderColor: "var(--brand-maroon)", color: "var(--brand-maroon)", backgroundColor: "var(--brand-white)" }}
                    />
                    <span style={{ color: "var(--brand-warm-grey)" }}>meters</span>
                    <span className="font-black text-lg ml-auto" style={{ color: "var(--brand-red)" }}>
                      = ₹{(product.price * length).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm" style={{ color: "var(--brand-maroon)" }}>Select Size</span>
                    <button className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--brand-warm-grey)" }}>Size Guide</button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(product.availableSizes ?? ["S", "M", "L", "XL", "XXL"]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className="min-w-12 h-12 px-3 rounded-xl font-bold text-sm transition-all border-2"
                        style={{
                          backgroundColor: selectedSize === size ? "var(--brand-maroon)" : "var(--brand-white)",
                          color: selectedSize === size ? "var(--brand-ivory)" : "var(--brand-maroon)",
                          borderColor: selectedSize === size ? "var(--brand-maroon)" : "rgba(59,10,10,0.2)",
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
                <button className="px-4 py-3 font-bold text-lg" style={{ color: "var(--brand-maroon)" }} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="px-4 font-bold" style={{ color: "var(--brand-maroon)" }}>{qty}</span>
                <button className="px-4 py-3 font-bold text-lg" style={{ color: "var(--brand-maroon)" }} onClick={() => setQty(qty + 1)}>+</button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: addedToCart ? "var(--brand-maroon)" : "var(--brand-red)",
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
                  borderColor: wishlisted ? "var(--brand-red)" : "rgba(59,10,10,0.2)",
                  backgroundColor: wishlisted ? "rgba(238,27,27,0.08)" : "var(--brand-white)",
                  color: wishlisted ? "var(--brand-red)" : "var(--brand-maroon)",
                }}
              >
                <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
              </button>

              <button
                className="w-12 h-12 rounded-xl border-2 flex items-center justify-center"
                style={{ borderColor: "rgba(59,10,10,0.2)", color: "var(--brand-maroon)", backgroundColor: "var(--brand-white)" }}
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Features */}
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: "var(--brand-blush)", borderColor: "rgba(59,10,10,0.1)" }}>
              <h3 className="font-black text-sm uppercase tracking-wider mb-3" style={{ color: "var(--brand-maroon)" }}>Product Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: "var(--brand-near-black)" }}>
                    <div className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ backgroundColor: "var(--brand-red)" }} />
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
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--brand-red)" }} />
              <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--brand-red)" }}>You May Also Like</span>
            </div>
            <h2 className="text-3xl font-black mb-8" style={{ color: "var(--brand-maroon)" }}>Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p.id} {...p} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
