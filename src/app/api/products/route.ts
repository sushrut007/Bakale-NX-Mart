import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") ?? "featured";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStockOnly = searchParams.get("inStockOnly") === "true";

    const where: any = {};

    if (category) {
      where.category = { equals: category };
    }

    if (brand) {
      where.brand = { equals: brand };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { category: { contains: search } },
        { brand: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (inStockOnly) {
      where.inStock = true;
    }

    let orderBy: any = {};
    switch (sort) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        // featured - in this mock we just sort by whether it's bestseller or new
        orderBy = [
          { isBestseller: "desc" },
          { isNew: "desc" }
        ];
        break;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    // Parse JSON stringified fields
    const formattedProducts = products.map((p) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [p.image],
      features: p.features ? JSON.parse(p.features) : [],
      availableSizes: p.availableSizes ? JSON.parse(p.availableSizes) : undefined,
      tags: p.tags ? JSON.parse(p.tags) : undefined,
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
