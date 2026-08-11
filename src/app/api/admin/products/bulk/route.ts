import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json({ error: "Invalid data format or empty array" }, { status: 400 });
    }

    const processedData = body.map((product: any) => ({
      name: product.name,
      brand: product.brand || "",
      category: product.category,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      image: product.image || "",
      images: JSON.stringify(product.images || (product.image ? [product.image] : [])),
      isCutPiece: Boolean(product.isCutPiece),
      inStock: product.inStock !== false, // default true
      description: product.description || "",
      features: JSON.stringify(Array.isArray(product.features) ? product.features : []),
      availableSizes: Array.isArray(product.availableSizes) ? JSON.stringify(product.availableSizes) : null,
      tags: Array.isArray(product.tags) ? JSON.stringify(product.tags) : null,
      rating: Number(product.rating) || 5.0,
      reviewCount: Number(product.reviewCount) || 0,
      isNew: Boolean(product.isNew),
      isBestseller: Boolean(product.isBestseller),
    }));

    const result = await prisma.product.createMany({
      data: processedData,
    });

    return NextResponse.json({ success: true, count: result.count }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to bulk import products:", error);
    return NextResponse.json({ error: error.message || "Failed to import products" }, { status: 500 });
  }
}
