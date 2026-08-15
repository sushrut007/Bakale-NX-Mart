"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ShoppingBag, ArrowRight, CreditCard, Truck, Smartphone } from "lucide-react";
import BrandLoader from "@/components/BrandLoader";
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

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-checkout-js")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    city: "Solapur",
    pincode: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shipping = totalPrice >= 1500 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // ── COD: submit directly ──────────────────────────────────────────────────
  const handleCOD = async () => {
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

  // ── ONLINE: open Razorpay modal ───────────────────────────────────────────
  const handleOnlinePayment = async () => {
    setLoading(true);
    setError(null);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Failed to load payment gateway. Check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create order on our backend
      const res = await fetch("/api/orders/create-payment", {
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
      if (!res.ok) throw new Error(data.error ?? "Could not create payment order");

      // 2. Open Razorpay checkout
      const rzpOptions = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Bakale NX Mart",
        description: `Order #${data.orderId}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: form.name,
          contact: form.phone,
        },
        theme: { color: "#EE1B1B" },
        handler: async (response: any) => {
          // 3. Verify signature on our backend
          const verifyRes = await fetch("/api/orders/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: data.orderId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.error ?? "Payment verification failed");
          setOrderId(verifyData.orderId);
          clearCart();
          setLoading(false);
        },
        modal: {
          ondismiss: () => {
            setError("Payment was cancelled. Please try again.");
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on("payment.failed", (response: any) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (paymentMethod === "COD") {
      handleCOD();
    } else {
      handleOnlinePayment();
    }
  };

  if (orderId) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center" style={{ backgroundColor: "var(--background-page)" }}>
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
            <CheckCircle size={80} style={{ color: "var(--accent)" }} />
          </motion.div>
          <h1 className="text-3xl font-black mb-3" style={{ color: "var(--primary)" }}>
            Order Placed! 🎉
          </h1>
          <p className="text-base leading-relaxed mb-2" style={{ color: "var(--text-primary)" }}>
            {paymentMethod === "ONLINE"
              ? "Thank you! Your payment was successful and your order is confirmed."
              : "Thank you for your order. Our team will contact you shortly at your provided number to confirm delivery details."}
          </p>
          <div
            className="my-6 px-5 py-4 rounded-2xl border"
            style={{ backgroundColor: "var(--background-surface)", borderColor: "rgba(42, 42, 140, 0.1)" }}
          >
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>
              Order ID
            </p>
            <p className="text-xl font-black" style={{ color: "var(--primary)" }}>
              {orderId}
            </p>
          </div>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            Questions? Call us at{" "}
            <a href="tel:+918805092070" className="font-bold" style={{ color: "var(--accent)" }}>
              +91 8805092070
            </a>
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-white text-sm uppercase tracking-wider"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24" style={{ backgroundColor: "var(--background-page)" }}>
      <Navbar />

      {/* Header */}
      <div
        className="py-10 border-b"
        style={{ backgroundColor: "var(--primary)", borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--accent)" }} />
            <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>
              Checkout
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: "var(--background-page)" }}>
            Complete Your Order
          </h1>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <ShoppingBag size={64} style={{ color: "var(--primary)", opacity: 0.15 }} />
          <p className="font-black text-xl" style={{ color: "var(--primary)" }}>No items to checkout</p>
          <Link href="/shop" className="px-8 py-4 rounded-full font-black text-white text-sm" style={{ backgroundColor: "var(--accent)" }}>
            Go to Shop <ArrowRight size={16} className="inline ml-1" />
          </Link>
        </div>
      ) : (
        <div className="container mx-auto px-4 md:px-6 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
              {/* Delivery Info */}
              <div
                className="rounded-2xl p-6 border"
                style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(42, 42, 140, 0.1)" }}
              >
                <h2 className="font-black text-base uppercase tracking-wider mb-5" style={{ color: "var(--primary)" }}>
                  Delivery Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "name", label: "Full Name", type: "text", placeholder: "Rahul Patil", required: true },
                    { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--primary)" }}>
                        {field.label} {field.required && <span style={{ color: "var(--accent)" }}>*</span>}
                      </label>
                      <input
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={form[field.name as keyof FormData]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 font-medium text-sm outline-none transition-colors"
                        style={{ borderColor: "rgba(59,10,10,0.2)", color: "var(--primary)", backgroundColor: "var(--background-page)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(59,10,10,0.2)")}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--primary)" }}>
                    Street Address <span style={{ color: "var(--accent)" }}>*</span>
                  </label>
                  <input
                    name="address" type="text" placeholder="House/Flat No., Street, Area" required
                    value={form.address} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 font-medium text-sm outline-none"
                    style={{ borderColor: "rgba(59,10,10,0.2)", color: "var(--primary)", backgroundColor: "var(--background-page)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(59,10,10,0.2)")}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--primary)" }}>City</label>
                    <input
                      name="city" type="text" value={form.city} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 font-medium text-sm outline-none"
                      style={{ borderColor: "rgba(59,10,10,0.2)", color: "var(--primary)", backgroundColor: "var(--background-page)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--primary)" }}>
                      PIN Code <span style={{ color: "var(--accent)" }}>*</span>
                    </label>
                    <input
                      name="pincode" type="text" placeholder="413002" required maxLength={6}
                      value={form.pincode} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 font-medium text-sm outline-none"
                      style={{ borderColor: "rgba(59,10,10,0.2)", color: "var(--primary)", backgroundColor: "var(--background-page)" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(59,10,10,0.2)")}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--primary)" }}>
                    Special Notes (Optional)
                  </label>
                  <textarea
                    name="notes" placeholder="Any special requirements or delivery instructions..."
                    rows={3} value={form.notes} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 font-medium text-sm outline-none resize-none"
                    style={{ borderColor: "rgba(59,10,10,0.2)", color: "var(--primary)", backgroundColor: "var(--background-page)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(59,10,10,0.2)")}
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div
                className="rounded-2xl p-6 border"
                style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(42, 42, 140, 0.1)" }}
              >
                <h2 className="font-black text-base uppercase tracking-wider mb-5" style={{ color: "var(--primary)" }}>
                  Payment Method
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* COD Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("COD")}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === "COD" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      paymentMethod === "COD" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="font-black text-sm" style={{ color: "var(--primary)" }}>Cash on Delivery</p>
                      <p className="text-xs text-gray-500 mt-0.5">Pay when you receive</p>
                    </div>
                    {paymentMethod === "COD" && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>

                  {/* Online Payment Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("ONLINE")}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === "ONLINE" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      paymentMethod === "ONLINE" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <p className="font-black text-sm" style={{ color: "var(--primary)" }}>Pay Online</p>
                      <p className="text-xs text-gray-500 mt-0.5">UPI, Cards, Netbanking</p>
                    </div>
                    {paymentMethod === "ONLINE" && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Info banner for selected method */}
                <div
                  className="mt-4 rounded-xl p-3 border"
                  style={{
                    backgroundColor: "rgba(238,27,27,0.04)",
                    borderColor: "rgba(238,27,27,0.15)",
                  }}
                >
                  {paymentMethod === "COD" ? (
                    <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                      💳 We accept cash, UPI (PhonePe, GPay, Paytm), and bank transfer. Our team will confirm payment details upon calling you.
                    </p>
                  ) : (
                    <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                      🔒 Secure payment via Razorpay. Supports all UPI apps, debit/credit cards, and netbanking. Your payment data is never stored on our servers.
                    </p>
                  )}
                </div>
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
                style={{ backgroundColor: "var(--accent)", boxShadow: "0 8px 24px rgba(238,27,27,0.3)" }}
              >
                {loading ? (
                  <><BrandLoader size={18} className="mr-2" /> Processing...</>
                ) : paymentMethod === "ONLINE" ? (
                  <><CreditCard size={18} /> Pay ₹{grandTotal.toLocaleString("en-IN")} Securely</>
                ) : (
                  <>Place Order — ₹{grandTotal.toLocaleString("en-IN")}</>
                )}
              </button>
            </form>

            {/* Order Summary Sidebar */}
            <div>
              <div
                className="rounded-2xl p-6 border sticky top-24"
                style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(42, 42, 140, 0.1)" }}
              >
                <h2 className="font-black text-base uppercase tracking-wider mb-4" style={{ color: "var(--primary)" }}>
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  {items.map((item, idx) => (
                    <div key={`${item.product.id}-${idx}`} className="flex gap-3">
                      <div className="w-12 h-14 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: "var(--background-surface)" }}>
                        <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold line-clamp-1" style={{ color: "var(--primary)" }}>{item.product.name}</p>
                        <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                          Qty: {item.quantity}
                          {item.selectedSize ? ` · ${item.selectedSize}` : ""}
                          {item.selectedLength ? ` · ${item.selectedLength}m` : ""}
                        </p>
                      </div>
                      <p className="text-xs font-black shrink-0" style={{ color: "var(--accent)" }}>
                        ₹{(item.product.price * item.quantity * (item.selectedLength ?? 1)).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="h-px mb-4" style={{ backgroundColor: "rgba(42, 42, 140, 0.1)" }} />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                    <span className="font-bold" style={{ color: "var(--primary)" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
                    <span className="font-bold" style={{ color: shipping === 0 ? "green" : "var(--primary)" }}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="h-px" style={{ backgroundColor: "rgba(42, 42, 140, 0.1)" }} />
                  <div className="flex justify-between font-black">
                    <span style={{ color: "var(--primary)" }}>Total</span>
                    <span className="text-xl" style={{ color: "var(--primary)" }}>₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mt-5 pt-4 border-t space-y-2" style={{ borderColor: "rgba(42, 42, 140, 0.08)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Secure & Trusted</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>🔒</span> <span>SSL encrypted checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>🏦</span> <span>Powered by Razorpay</span>
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
