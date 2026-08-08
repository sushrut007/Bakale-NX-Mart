"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateQty, clearCart } = useCart();

  const shipping = totalPrice >= 1500 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  return (
    <main className="min-h-screen pt-24" style={{ backgroundColor: "var(--background-page)" }}>
      <Navbar />

      {/* Header */}
      <div
        className="py-10 border-b"
        style={{
          backgroundColor: "var(--primary)",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--accent)" }} />
            <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>
              Your Cart
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: "var(--background-page)" }}>
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(253,251,243,0.55)" }}>
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <ShoppingBag size={72} style={{ color: "var(--primary)", opacity: 0.15 }} />
            <h2 className="text-2xl font-black" style={{ color: "var(--primary)" }}>
              Your cart is empty
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link
              href="/shop"
              className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider text-white flex items-center gap-2"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Start Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-black text-sm uppercase tracking-wider" style={{ color: "var(--primary)" }}>
                  {totalItems} Items
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Clear All
                </button>
              </div>

              {items.map((item, idx) => {
                const linePrice =
                  item.product.price * item.quantity * (item.selectedLength ?? 1);
                return (
                  <motion.div
                    key={`${item.product.id}-${item.selectedSize ?? idx}`}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    className="flex gap-5 p-5 rounded-2xl border"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "rgba(42, 42, 140, 0.1)",
                    }}
                  >
                    {/* Image */}
                    <Link href={`/product/${item.product.id}`}>
                      <div
                        className="w-28 h-36 rounded-xl overflow-hidden shrink-0"
                        style={{ backgroundColor: "var(--background-surface)" }}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-secondary)" }}>
                        {item.product.brand} · {item.product.category}
                      </p>
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="font-black text-base leading-snug mb-2" style={{ color: "var(--primary)" }}>
                          {item.product.name}
                        </h3>
                      </Link>

                      {item.selectedSize && (
                        <span
                          className="inline-block text-xs font-bold px-2 py-0.5 rounded-md mb-3"
                          style={{ backgroundColor: "var(--background-surface)", color: "var(--primary)" }}
                        >
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedLength && (
                        <span
                          className="inline-block text-xs font-bold px-2 py-0.5 rounded-md mb-3"
                          style={{ backgroundColor: "var(--background-surface)", color: "var(--primary)" }}
                        >
                          Length: {item.selectedLength}m
                        </span>
                      )}

                      <div className="flex items-center justify-between flex-wrap gap-3">
                        {/* Qty */}
                        <div
                          className="flex items-center gap-1 border-2 rounded-xl overflow-hidden"
                          style={{ borderColor: "rgba(59,10,10,0.15)" }}
                        >
                          <button
                            className="px-3 py-2 font-bold transition-colors"
                            style={{ color: "var(--primary)" }}
                            onClick={() =>
                              updateQty(item.product.id, item.quantity - 1, item.selectedSize)
                            }
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            className="px-3 font-black text-sm"
                            style={{ color: "var(--primary)" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            className="px-3 py-2 font-bold transition-colors"
                            style={{ color: "var(--primary)" }}
                            onClick={() =>
                              updateQty(item.product.id, item.quantity + 1, item.selectedSize)
                            }
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <span className="font-black text-xl" style={{ color: "var(--accent)" }}>
                          ₹{linePrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.product.id, item.selectedSize)}
                      className="self-start p-2 rounded-xl transition-colors hover:bg-red-50"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="rounded-2xl p-6 border sticky top-24"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(42, 42, 140, 0.1)",
                }}
              >
                <h2 className="font-black text-lg mb-5 uppercase tracking-wider" style={{ color: "var(--primary)" }}>
                  Order Summary
                </h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>Subtotal ({totalItems} items)</span>
                    <span className="font-bold" style={{ color: "var(--primary)" }}>
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
                    <span className="font-bold" style={{ color: shipping === 0 ? "green" : "var(--primary)" }}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Add ₹{(1500 - totalPrice).toLocaleString("en-IN")} more for free shipping
                    </p>
                  )}
                  <div
                    className="h-px my-2"
                    style={{ backgroundColor: "rgba(42, 42, 140, 0.1)" }}
                  />
                  <div className="flex justify-between">
                    <span className="font-black" style={{ color: "var(--primary)" }}>Total</span>
                    <span className="font-black text-2xl" style={{ color: "var(--primary)" }}>
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider text-white text-center transition-all"
                  style={{
                    backgroundColor: "var(--accent)",
                    boxShadow: "0 6px 20px rgba(238,27,27,0.3)",
                  }}
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  className="block mt-3 text-center text-sm font-bold uppercase tracking-wider"
                  style={{ color: "var(--primary)" }}
                >
                  ← Continue Shopping
                </Link>

                {/* Trust badges */}
                <div
                  className="mt-5 pt-4 border-t space-y-2"
                  style={{ borderColor: "rgba(42, 42, 140, 0.1)" }}
                >
                  {["🔒 Secure checkout", "📞 WhatsApp support", "✅ Quality guaranteed"].map(
                    (badge) => (
                      <p key={badge} className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {badge}
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
