import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Parse JSON fields before passing to form
  const formattedProduct = {
    ...product,
    images: product.images ? JSON.parse(product.images) : [product.image],
    features: product.features ? JSON.parse(product.features) : [],
    availableSizes: product.availableSizes ? JSON.parse(product.availableSizes) : undefined,
    tags: product.tags ? JSON.parse(product.tags) : undefined,
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
          Edit Product
        </h1>
      </div>

      <ProductForm mode="edit" initialData={formattedProduct} />
    </div>
  );
}
