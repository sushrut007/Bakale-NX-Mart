import type { Metadata } from "next";
import { Baloo_2, Inter, Noto_Sans_Devanagari, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const fontHeading = Baloo_2({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const fontBody = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const fontDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
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
      className={`${fontHeading.variable} ${fontBody.variable} ${fontDevanagari.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "var(--background-page)", color: "var(--text-primary)" }}
      >
        <CartProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
