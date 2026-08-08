"use client";

import { categories, brands, minPrice as globalMin, maxPrice as globalMax } from "@/data/products";
import { FilterState, SortOption } from "@/types";

interface CategoryFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClose?: () => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function CategoryFilter({ filters, onChange, onClose }: CategoryFilterProps) {
  const update = (partial: Partial<FilterState>) =>
    onChange({ ...filters, ...partial });

  const reset = () =>
    onChange({
      category: "",
      brand: "",
      minPrice: globalMin,
      maxPrice: globalMax,
      inStockOnly: false,
      sortBy: "featured",
    });

  return (
    <div
      className="rounded-2xl p-5 border sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "rgba(42, 42, 140, 0.1)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-black text-base uppercase tracking-wider" style={{ color: "var(--primary)" }}>
          Filters
        </h3>
        <button
          onClick={reset}
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: "var(--accent)" }}
        >
          Reset All
        </button>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-secondary)" }}>
          Sort By
        </h4>
        <div className="space-y-1.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ sortBy: opt.value })}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor:
                  filters.sortBy === opt.value
                    ? "var(--primary)"
                    : "transparent",
                color:
                  filters.sortBy === opt.value
                    ? "var(--background-page)"
                    : "var(--text-primary)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="mb-6">
        <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-secondary)" }}>
          Category
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => update({ category: "" })}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: !filters.category ? "var(--primary)" : "transparent",
              color: !filters.category ? "var(--background-page)" : "var(--text-primary)",
            }}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => update({ category: cat })}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor:
                  filters.category === cat ? "var(--primary)" : "transparent",
                color:
                  filters.category === cat
                    ? "var(--background-page)"
                    : "var(--text-primary)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="mb-6">
        <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-secondary)" }}>
          Brand
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => update({ brand: "" })}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: !filters.brand ? "var(--primary)" : "transparent",
              color: !filters.brand ? "var(--background-page)" : "var(--text-primary)",
            }}
          >
            All Brands
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => update({ brand: b })}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor:
                  filters.brand === b ? "var(--primary)" : "transparent",
                color:
                  filters.brand === b
                    ? "var(--background-page)"
                    : "var(--text-primary)",
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-secondary)" }}>
          Price Range
        </h4>
        <div className="flex gap-2 items-center">
          <div
            className="flex-1 border rounded-lg overflow-hidden flex items-center px-2"
            style={{ borderColor: "rgba(59,10,10,0.2)" }}
          >
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>₹</span>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => update({ minPrice: Number(e.target.value) })}
              className="w-full p-2 text-sm font-medium outline-none bg-transparent"
              style={{ color: "var(--primary)" }}
              min={globalMin}
              max={filters.maxPrice}
            />
          </div>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>to</span>
          <div
            className="flex-1 border rounded-lg overflow-hidden flex items-center px-2"
            style={{ borderColor: "rgba(59,10,10,0.2)" }}
          >
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>₹</span>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => update({ maxPrice: Number(e.target.value) })}
              className="w-full p-2 text-sm font-medium outline-none bg-transparent"
              style={{ color: "var(--primary)" }}
              min={filters.minPrice}
              max={globalMax}
            />
          </div>
        </div>
      </div>

      {/* In Stock Only */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm" style={{ color: "var(--primary)" }}>
          In Stock Only
        </span>
        <button
          onClick={() => update({ inStockOnly: !filters.inStockOnly })}
          className="relative w-11 h-6 rounded-full transition-all"
          style={{
            backgroundColor: filters.inStockOnly
              ? "var(--accent)"
              : "rgba(59,10,10,0.15)",
          }}
        >
          <span
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
            style={{ left: filters.inStockOnly ? "calc(100% - 1.375rem)" : "0.125rem" }}
          />
        </button>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-white"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Apply Filters
        </button>
      )}
    </div>
  );
}
