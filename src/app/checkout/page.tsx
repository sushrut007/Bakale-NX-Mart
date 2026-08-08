"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

type FormData = {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes: string;
};

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    city: "Solapur",
    pincode: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shipping = totalPrice >= 1500 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerPhone: form.phone,
          customerAddress: `${form.address}, ${form.city} - ${form.pincode}`,
          items,
          totalPrice: grandTotal,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to place order");

      setOrderId(data.orderId);
      clearCart();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center" style={{ backgroundColor: "var(--brand-ivory)" }}>
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <CheckCircle size={80} style={{ color: "var(--brand-red)" }} />
          </motion.div>
          <h1 className="text-3xl font-black mb-3" style={{ color: "var(--brand-maroon)" }}>
            Order Placed! 🎉
          </h1>
          <p className="text-base leading-relaxed mb-2" style={{ color: "var(--brand-near-black)" }}>
            Thank you for your order. Our team will contact you shortly at your provided number to confirm delivery details.
          </p>
          <div
            className="my-6 px-5 py-4 rounded-2xl border"
            style={{
              backgroundColor: "var(--brand-blush)",
              borderColor: "rgba(59,10,10,0.1)",
            }}
          >
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--brand-warm-grey)" }}>
              Order ID
            </p>
            <p className="text-xl font-black" style={{ color: "var(--brand-maroon)" }}>
              {orderId}
            </p>
          </div>
          <p className="text-sm mb-8" style={{ color: "var(--brand-warm-grey)" }}>
            Questions? Call us at{" "}
            <a href="tel:+918805092070" className="font-bold" style={{ color: "var(--brand-red)" }}>
              +91 8805092070
            </a>
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-white text-sm uppercase tracking-wider"
            style={{ backgroundColor: "var(--brand-maroon)" }}
          >
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24" style={{ backgroundColor: "var(--brand-ivory)" }}>
      <Navbar />

      {/* Header */}
      <div
        className="py-10 border-b"
        style={{
          backgroundColor: "var(--brand-maroon)",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--brand-red)" }} />
            <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--brand-red)" }}>
              Checkout
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: "var(--brand-ivory)" }}>
            Complete Your Order
          </h1>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <ShoppingBag size={64} style={{ color: "var(--brand-maroon)", opacity: 0.15 }} />
          <p className="font-black text-xl" style={{ color: "var(--brand-maroon)" }}>No items to checkout</p>
          <Link href="/shop" className="px-8 py-4 rounded-full font-black text-white text-sm" style={{ backgroundColor: "var(--brand-red)" }}>
            Go to Shop <ArrowRight size={16} className="inline ml-1" />
          </Link>
        </div>
      ) : (
        <div className="container mx-auto px-4 md:px-6 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
              <div
                className="rounded-2xl p-6 border"
                style={{
                  backgroundColor: "var(--brand-white)",
                  borderColor: "rgba(59,10,10,0.1)",
                }}
              >
                <h2 className="font-black text-base uppercase tracking-wider mb-5" style={{ color: "var(--brand-maroon)" }}>
                  Delivery Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "name", label: "Full Name", type: "text", placeholder: "Rahul Patil", required: true },
                    { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true },
                  ].map((field) => (
                    <div key={field.name}>
                      <label
                        className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                        style={{ color: "var(--brand-maroon)" }}
                      >
                        {field.label} {field.required && <span style={{ color: "var(--brand-red)" }}>*</span>}
                      </label>
                      <input
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={form[field.name as keyof FormData]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 font-medium text-sm outline-none transition-colors"
                        style={{
                          borderColor: "rgba(59,10,10,0.2)",
                          color: "var(--brand-maroon)",
                          backgroundColor: "var(--brand-ivory)",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-red)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(59,10,10,0.2)")}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brand-maroon)" }}>
                    Street Address <span style={{ color: "var(--brand-red)" }}>*</span>
                  </label>
                  <input
                    name="address"
                    type="text"
                    placeholder="House/Flat No., Street, Area"
                    required
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 font-medium text-sm outline-none"
                    style={{
                      borderColor: "rgba(59,10,10,0.2)",
                      color: "var(--brand-maroon)",
                      backgroundColor: "var(--brand-ivory)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-red)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(59,10,10,0.2)")}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brand-maroon)" }}>
                      City
                    </label>
                    <input
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 font-medium text-sm outline-none"
                      style={{
                        borderColor: "rgba(59,10,10,0.2)",
                        color: "var(--brand-maroon)",
                        backgroundColor: "var(--brand-ivory)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brand-maroon)" }}>
                      PIN Code <span style={{ color: "var(--brand-red)" }}>*</span>
                    </label>
                    <input
                      name="pincode"
                      type="text"
                      placeholder="413002"
                      required
                      maxLength={6}
                      value={form.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 font-medium text-sm outline-none"
                      style={{
                        borderColor: "rgba(59,10,10,0.2)",
                        color: "var(--brand-maroon)",
                        backgroundColor: "var(--brand-ivory)",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-red)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(59,10,10,0.2)")}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brand-maroon)" }}>
                    Special Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    placeholder="Any special requirements or delivery instructions..."
                    rows={3}
                    value={form.notes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 font-medium text-sm outline-none resize-none"
                    style={{
                      borderColor: "rgba(59,10,10,0.2)",
                      color: "var(--brand-maroon)",
                      backgroundColor: "var(--brand-ivory)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-red)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(59,10,10,0.2)")}
                  />
                </div>
              </div>

              {/* Payment note */}
              <div
                className="rounded-2xl p-4 border"
                style={{
                  backgroundColor: "rgba(238,27,27,0.05)",
                  borderColor: "rgba(238,27,27,0.2)",
                }}
              >
                <p className="text-sm font-bold" style={{ color: "var(--brand-maroon)" }}>
                  💳 Payment on Delivery
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--brand-warm-grey)" }}>
                  We accept cash, UPI (PhonePe, GPay, Paytm), and bank transfer. Our team will confirm payment details upon calling you.
                </p>
              </div>

              {error && (
                <div className="rounded-xl p-4 bg-red-50 border border-red-200">
                  <p className="text-sm font-bold text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider text-white flex items-center justify-center gap-3 transition-all disabled:opacity-70"
                style={{
                  backgroundColor: "var(--brand-red)",
                  boxShadow: "0 8px 24px rgba(238,27,27,0.3)",
                }}
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Placing Order...</>
                ) : (
                  <>Place Order — ₹{grandTotal.toLocaleString("en-IN")}</>
                )}
              </button>
            </form>

            {/* Summary */}
            <div>
              <div
                className="rounded-2xl p-6 border sticky top-24"
                style={{
                  backgroundColor: "var(--brand-white)",
                  borderColor: "rgba(59,10,10,0.1)",
                }}
              >
                <h2 className="font-black text-base uppercase tracking-wider mb-4" style={{ color: "var(--brand-maroon)" }}>
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  {items.map((item, idx) => (
                    <div key={`${item.product.id}-${idx}`} className="flex gap-3">
                      <div
                        className="w-12 h-14 rounded-lg overflow-hidden shrink-0"
                        style={{ backgroundColor: "var(--brand-blush)" }}
                      >
                        <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold line-clamp-1" style={{ color: "var(--brand-maroon)" }}>
                          {item.product.name}
                        </p>
                        <p className="text-[10px]" style={{ color: "var(--brand-warm-grey)" }}>
                          Qty: {item.quantity}
                          {item.selectedSize ? ` · ${item.selectedSize}` : ""}
                          {item.selectedLength ? ` · ${item.selectedLength}m` : ""}
                        </p>
                      </div>
                      <p className="text-xs font-black shrink-0" style={{ color: "var(--brand-red)" }}>
                        ₹{(item.product.price * item.quantity * (item.selectedLength ?? 1)).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="h-px mb-4" style={{ backgroundColor: "rgba(59,10,10,0.1)" }} />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--brand-warm-grey)" }}>Subtotal</span>
                    <span className="font-bold" style={{ color: "var(--brand-maroon)" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--brand-warm-grey)" }}>Shipping</span>
                    <span className="font-bold" style={{ color: shipping === 0 ? "green" : "var(--brand-maroon)" }}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="h-px" style={{ backgroundColor: "rgba(59,10,10,0.1)" }} />
                  <div className="flex justify-between font-black">
                    <span style={{ color: "var(--brand-maroon)" }}>Total</span>
                    <span className="text-xl" style={{ color: "var(--brand-maroon)" }}>₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
