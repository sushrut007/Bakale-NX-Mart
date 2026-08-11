"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, X, Upload, Link as LinkIcon } from "lucide-react";
import BrandLoader from "@/components/BrandLoader";

export default function ProductForm({ 
  initialData, 
  mode = "create" 
}: { 
  initialData?: any; 
  mode?: "create" | "edit";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    brand: initialData?.brand || "",
    category: initialData?.category || "Suiting",
    price: initialData?.price || "",
    originalPrice: initialData?.originalPrice || "",
    image: initialData?.image || "",
    description: initialData?.description || "",
    isCutPiece: initialData?.isCutPiece || false,
    inStock: initialData?.inStock ?? true,
    isNew: initialData?.isNew || false,
    isBestseller: initialData?.isBestseller || false,
  });

  const [features, setFeatures] = useState<string[]>(
    initialData?.features?.length ? initialData.features : [""]
  );

  const [imageMode, setImageMode] = useState<"url" | "upload">(
    initialData?.image && initialData.image.startsWith("data:image") ? "upload" : "url"
  );

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
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

      const endpoint = mode === "create" 
        ? "/api/admin/products" 
        : `/api/admin/products/${initialData.id}`;
        
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-medium">
          {error}
        </div>
      )}

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
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-700">Image *</label>
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    imageMode === "url" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <LinkIcon size={12} className="inline mr-1" /> URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    imageMode === "upload" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Upload size={12} className="inline mr-1" /> Upload
                </button>
              </div>
            </div>
            
            {imageMode === "url" ? (
              <input
                required={!formData.image}
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
                placeholder="https://..."
              />
            ) : (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl focus:outline-none hover:bg-gray-100 transition-all text-gray-600 font-medium flex items-center justify-center gap-2"
                >
                  <Upload size={16} /> 
                  {formData.image && formData.image.startsWith('data:image') 
                    ? "Change Uploaded Image" 
                    : "Select Image to Upload"}
                </button>
              </div>
            )}
            
            {formData.image && (
              <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
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
          {loading ? "Saving..." : (mode === "create" ? "Save Product" : "Update Product")}
        </button>
      </div>
    </form>
  );
}
