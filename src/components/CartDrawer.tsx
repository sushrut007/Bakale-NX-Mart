"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, totalItems, totalPrice, isDrawerOpen, closeDrawer, removeItem, updateQty } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md flex flex-col shadow-2xl"
            style={{ backgroundColor: "var(--background-page)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{
                backgroundColor: "var(--primary)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} style={{ color: "var(--background-page)" }} />
                <span className="font-black text-lg" style={{ color: "var(--background-page)" }}>
                  Your Cart
                </span>
                {totalItems > 0 && (
                  <span
                    className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center"
                    style={{ backgroundColor: "var(--accent)", color: "white" }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-full transition-colors hover:bg-white/10"
                style={{ color: "var(--background-page)" }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                  <ShoppingBag size={56} style={{ color: "var(--primary)", opacity: 0.2 }} />
                  <p className="font-bold text-lg" style={{ color: "var(--primary)" }}>
                    Your cart is empty
                  </p>
                  <p className="text-sm text-center" style={{ color: "var(--text-secondary)" }}>
                    Add some products from our shop to get started
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeDrawer}
                    className="mt-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider text-white"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    Browse Shop
                  </Link>
                </div>
              ) : (
                items.map((item, idx) => {
                  const linePrice =
                    item.product.price *
                    item.quantity *
                    (item.selectedLength ?? 1);
                  return (
                    <motion.div
                      key={`${item.product.id}-${item.selectedSize ?? idx}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 rounded-2xl border"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "rgba(42, 42, 140, 0.1)",
                      }}
                    >
                      {/* Image */}
                      <div
                        className="w-20 h-24 rounded-xl overflow-hidden shrink-0"
                        style={{ backgroundColor: "var(--background-surface)" }}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "var(--text-secondary)" }}>
                          {item.product.brand}
                        </p>
                        <h4 className="font-bold text-sm leading-snug line-clamp-2 mb-1" style={{ color: "var(--primary)" }}>
                          {item.product.name}
                        </h4>
                        {item.selectedSize && (
                          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            Size: {item.selectedSize}
                          </p>
                        )}
                        {item.selectedLength && (
                          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            Length: {item.selectedLength}m
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          {/* Qty Controls */}
                          <div
                            className="flex items-center gap-1 border rounded-lg overflow-hidden"
                            style={{ borderColor: "rgba(59,10,10,0.15)" }}
                          >
                            <button
                              className="px-2 py-1 font-bold transition-colors"
                              style={{ color: "var(--primary)" }}
                              onClick={() =>
                                updateQty(
                                  item.product.id,
                                  item.quantity - 1,
                                  item.selectedSize
                                )
                              }
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 text-sm font-bold" style={{ color: "var(--primary)" }}>
                              {item.quantity}
                            </span>
                            <button
                              className="px-2 py-1 font-bold transition-colors"
                              style={{ color: "var(--primary)" }}
                              onClick={() =>
                                updateQty(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.selectedSize
                                )
                              }
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <span className="font-black text-sm" style={{ color: "var(--accent)" }}>
                            ₹{linePrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.product.id, item.selectedSize)}
                        className="self-start p-1.5 rounded-lg transition-colors hover:bg-red-50"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="px-5 py-5 border-t space-y-3"
                style={{
                  borderColor: "rgba(42, 42, 140, 0.1)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold" style={{ color: "var(--primary)" }}>
                    Subtotal
                  </span>
                  <span className="font-black text-xl" style={{ color: "var(--primary)" }}>
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Shipping & taxes calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Checkout
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full py-3 rounded-xl font-bold text-sm text-center border-2 transition-all"
                  style={{
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                  }}
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
