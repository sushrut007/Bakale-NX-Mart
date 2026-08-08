"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import BrandLoader from "@/components/BrandLoader";

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "Suiting",
    price: "",
    originalPrice: "",
    image: "",
    description: "",
    isCutPiece: false,
    inStock: true,
    isNew: false,
    isBestseller: false,
  });

  const [features, setFeatures] = useState<string[]>([""]);

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => setFeatures([...features, ""]);
  
  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        features: features.filter(f => f.trim() !== ""),
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create product");

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-black" style={{ color: "var(--primary)" }}>
          Add New Product
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black mb-6 uppercase tracking-wider text-gray-800 border-b pb-4">
            Basic Details
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Product Name *</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
                placeholder="e.g. Raymond Premium Suiting"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
                placeholder="e.g. Raymond"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Category *</label>
              <select
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
              >
                <option value="Suiting">Suiting</option>
                <option value="Shirting">Shirting</option>
                <option value="Readymade Shirt">Readymade Shirt</option>
                <option value="Trouser">Trouser</option>
                <option value="Ethnic">Ethnic Wear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Image URL *</label>
              <input
                required
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black mb-6 uppercase tracking-wider text-gray-800 border-b pb-4">
            Pricing & Description
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Selling Price (₹) *</label>
              <input
                required
                type="number"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all font-bold text-red-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Original Price (₹) (Optional)</label>
              <input
                type="number"
                min="0"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
                placeholder="Crossed out price"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Product Description *</label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all resize-none"
              placeholder="Detailed description of the fabric or garment..."
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black mb-6 uppercase tracking-wider text-gray-800 border-b pb-4">
              Product Features
            </h2>
            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500"
                    placeholder="e.g. 100% Pure Cotton"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-200 rounded-xl font-bold text-sm text-gray-500 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <Plus size={16} /> Add Feature
              </button>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black mb-6 uppercase tracking-wider text-gray-800 border-b pb-4">
              Inventory & Status
            </h2>
            <div className="space-y-4">
              {[
                { name: "inStock", label: "In Stock (Available for purchase)" },
                { name: "isCutPiece", label: "Is Cut-Piece (Sold by meter)" },
                { name: "isNew", label: "New Arrival Badge" },
                { name: "isBestseller", label: "Bestseller Badge" },
              ].map((field) => (
                <label key={field.name} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={(formData as any)[field.name]}
                      onChange={handleChange}
                      className="w-5 h-5 border-2 border-gray-300 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{field.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-white text-sm uppercase tracking-wider transition-opacity disabled:opacity-50 hover:opacity-90 shadow-xl shadow-red-900/20"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {loading ? <BrandLoader size={18} /> : <Save size={18} />}
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
