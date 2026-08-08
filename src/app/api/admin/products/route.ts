import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Process JSON fields
    const data = {
      ...body,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      images: JSON.stringify(body.images || [body.image]),
      features: JSON.stringify(body.features || []),
      availableSizes: body.availableSizes ? JSON.stringify(body.availableSizes) : null,
      tags: body.tags ? JSON.stringify(body.tags) : null,
      rating: Number(body.rating) || 5.0,
      reviewCount: Number(body.reviewCount) || 0,
    };

    const product = await prisma.product.create({
      data,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
