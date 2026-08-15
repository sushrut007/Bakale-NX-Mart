"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

type ProductCardProps = Product;

export default function ProductCard(product: ProductCardProps) {
  const { id, name, category, price, image, isCutPiece, brand, inStock, isNew, isBestseller } = product;
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCutPiece) {
      addItem(product, 1, undefined, 1.5);
    } else {
      addItem(product, 1, selectedSize ?? "M");
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      className="group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-500"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: isHovered ? "var(--primary)" : "rgba(42, 42, 140, 0.1)",
        boxShadow: isHovered
          ? "0 20px 40px rgba(59,10,10,0.15)"
          : "0 2px 8px rgba(59,10,10,0.06)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Container */}
      <div
        className="relative aspect-[4/5] overflow-hidden"
        style={{ backgroundColor: "var(--background-surface)" }}
      >
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-all"
          animate={{ scale: isHovered ? 1.06 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onError={(e) => { 
            e.currentTarget.src = "/logo-icon.jpg";
            e.currentTarget.classList.remove("object-cover");
            e.currentTarget.classList.add("object-contain", "p-8", "opacity-50");
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{ backgroundColor: "var(--primary)", color: "var(--background-page)" }}
          >
            {category}
          </span>
          {isNew && (
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
              style={{ backgroundColor: "var(--accent)", color: "white" }}
            >
              New
            </span>
          )}
          {isBestseller && (
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
              style={{ backgroundColor: "var(--primary-dark)", color: "var(--background-page)" }}
            >
              Bestseller
            </span>
          )}
        </div>

        {/* Cut-piece per meter tag */}
        {isCutPiece && (
          <div className="absolute top-3 right-10">
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{ backgroundColor: "var(--accent)", color: "white" }}
            >
              /meter
            </span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(59,10,10,0.6)" }}
          >
            <span className="font-black text-sm uppercase tracking-widest text-white">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: isWishlisted ? "var(--accent)" : "rgba(255,255,255,0.9)",
            color: isWishlisted ? "white" : "var(--primary)",
          }}
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label="Wishlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick Add overlay */}
        {inStock && (
          <motion.div
            className="absolute inset-x-0 bottom-0 p-3"
            style={{
              background: "linear-gradient(to top, rgba(59,10,10,0.9) 0%, transparent 100%)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 16 }}
            transition={{ duration: 0.25 }}
          >
            {isCutPiece ? (
              <button
                onClick={handleAddToCart}
                className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                style={{
                  backgroundColor: added ? "var(--primary)" : "var(--accent)",
                  color: "white",
                }}
              >
                {added ? <><Check size={15} /> Added!</> : <><ShoppingCart size={15} /> Add to Cart (1.5m)</>}
              </button>
            ) : (
              <div className="flex gap-1.5">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedSize(size);
                      addItem(product, 1, size);
                      setAdded(true);
                      setTimeout(() => setAdded(false), 1800);
                    }}
                    className="flex-1 py-2 rounded-lg font-bold text-xs transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      color: "var(--primary)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent)";
                      (e.currentTarget as HTMLElement).style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "#FFFFFF";
                      (e.currentTarget as HTMLElement).style.color = "var(--primary)";
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {brand && (
          <span
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {brand}
          </span>
        )}
        <Link href={`/product/${id}`} className="block mb-auto">
          <h3
            className="text-sm font-bold leading-snug line-clamp-2 transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            {name}
          </h3>
        </Link>
        <div
          className="flex items-center justify-between mt-3 pt-3 border-t"
          style={{ borderColor: "rgba(59,10,10,0.08)" }}
        >
          <span className="text-xl font-black" style={{ color: "var(--primary)" }}>
            ₹{price.toLocaleString("en-IN")}
            {isCutPiece && (
              <span className="text-xs font-normal ml-1" style={{ color: "var(--text-secondary)" }}>
                /m
              </span>
            )}
          </span>
          <Link
            href={`/product/${id}`}
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--accent)" }}
          >
            View →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
