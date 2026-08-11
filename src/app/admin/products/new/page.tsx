"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProduct() {
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

      <ProductForm mode="create" />
    </div>
  );
}
