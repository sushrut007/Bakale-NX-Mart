"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Grid3X3, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { products, minPrice as gMin, maxPrice as gMax } from "@/data/products";
import { FilterState } from "@/types";

const defaultFilters: FilterState = {
  category: "",
  brand: "",
  minPrice: gMin,
  maxPrice: gMax,
  inStockOnly: false,
  sortBy: "featured",
};

function ShopContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    category: searchParams.get("category") ?? "",
  });
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const cat = searchParams.get("category");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cat) setFilters((f) => ({ ...f, category: cat }));
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (filters.category) {
      result = result.filter(
        (p) => p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    if (filters.brand) {
      result = result.filter((p) => p.brand === filters.brand);
    }
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (filters.sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "newest": result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return result;
  }, [filters, searchQuery]);

  return (
    <main className="min-h-screen pt-24" style={{ backgroundColor: "var(--background-page)" }}>
      <Navbar />

      {/* Page Header */}
      <div
        className="py-12 border-b"
        style={{
          backgroundColor: "var(--primary)",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "var(--accent)" }} />
            <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>
              Full Collection
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: "var(--background-page)" }}>
            Shop All Products
          </h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(253,251,243,0.6)" }}>
            {filtered.length} products
            {filters.category ? ` in ${filters.category}` : ""}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Search + Controls bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "rgba(59,10,10,0.15)",
            }}
          >
            <Search size={18} style={{ color: "var(--text-secondary)" }} />
            <input
              type="text"
              placeholder="Search fabrics, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium outline-none"
              style={{ color: "var(--primary)" }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X size={16} style={{ color: "var(--text-secondary)" }} />
              </button>
            )}
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm border"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--background-page)",
              borderColor: "var(--primary)",
            }}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          {/* View mode */}
          <div
            className="hidden sm:flex items-center gap-1 p-1 rounded-xl border"
            style={{ borderColor: "rgba(59,10,10,0.15)", backgroundColor: "#FFFFFF" }}
          >
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="p-2 rounded-lg transition-all"
                style={{
                  backgroundColor: viewMode === mode ? "var(--primary)" : "transparent",
                  color: viewMode === mode ? "white" : "var(--text-secondary)",
                }}
              >
                {mode === "grid" ? <Grid3X3 size={18} /> : <List size={18} />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-60 shrink-0">
            <CategoryFilter filters={filters} onChange={setFilters} />
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {isFilterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/50"
                  onClick={() => setIsFilterOpen(false)}
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 30 }}
                  className="fixed left-0 top-0 bottom-0 z-50 w-80 overflow-y-auto p-5"
                  style={{ backgroundColor: "var(--background-page)" }}
                >
                  <CategoryFilter
                    filters={filters}
                    onChange={setFilters}
                    onClose={() => setIsFilterOpen(false)}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="text-5xl">🔍</div>
                <p className="font-bold text-xl" style={{ color: "var(--primary)" }}>
                  No products found
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Try adjusting your filters or search term
                </p>
                <button
                  onClick={() => {
                    setFilters(defaultFilters);
                    setSearchQuery("");
                  }}
                  className="px-6 py-3 rounded-full font-bold text-sm text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    : "flex flex-col gap-4"
                }
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard {...product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: "var(--background-page)" }} className="min-h-screen" />}>
      <ShopContent />
    </Suspense>
  );
}
