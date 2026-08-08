"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black" style={{ color: "var(--brand-maroon)" }}>
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--brand-red)" }}
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Product</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Category</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Price</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Stock</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.currentTarget.src = "/logo.png" }}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {product.category}
                    {product.isCutPiece && <span className="ml-2 text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Cut-piece</span>}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    {product.inStock ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/product/${product.id}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors"
                        title="View on store"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors"
                        title="Edit product (Coming soon)"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
