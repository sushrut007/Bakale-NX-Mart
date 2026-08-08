import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bakale Nx Cut-piece & Readymade | Premium Fabrics in Solapur",
  description:
    "Solapur's premier destination for premium cut-piece fabrics and readymade garments. Raymond, Gwalior, OCM and more. Visit us at Kanna Chowk, Bhavani Peth, Solapur.",
  keywords: "fabric store solapur, raymond fabric solapur, cut piece solapur, readymade solapur, bakale nx",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "var(--brand-ivory)", color: "var(--brand-near-black)" }}
      >
        <CartProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
