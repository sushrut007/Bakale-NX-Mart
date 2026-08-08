import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const formattedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [product.image],
      features: product.features ? JSON.parse(product.features) : [],
      availableSizes: product.availableSizes ? JSON.parse(product.availableSizes) : undefined,
      tags: product.tags ? JSON.parse(product.tags) : undefined,
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
