import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { products } from "../src/data/products";

const adapter = new PrismaLibSql({ 
  url: process.env.DATABASE_URL || "file:./dev.db" 
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding started...");

  for (const product of products) {
    const existing = await prisma.product.findUnique({
      where: { id: product.id },
    });

    if (!existing) {
      await prisma.product.create({
        data: {
          id: product.id,
          name: product.name,
          category: product.category,
          brand: product.brand,
          price: product.price,
          originalPrice: product.originalPrice ?? null,
          image: product.image,
          images: JSON.stringify(product.images ?? [product.image]),
          isCutPiece: product.isCutPiece,
          inStock: product.inStock,
          description: product.description,
          features: JSON.stringify(product.features),
          availableSizes: product.availableSizes ? JSON.stringify(product.availableSizes) : null,
          tags: product.tags ? JSON.stringify(product.tags) : null,
          rating: product.rating ?? 5.0,
          reviewCount: product.reviewCount ?? 0,
          isNew: product.isNew ?? false,
          isBestseller: product.isBestseller ?? false,
        },
      });
      console.log(`Created product: ${product.name}`);
    } else {
      console.log(`Product already exists: ${product.name}`);
    }
  }

  // Also create a default admin
  const adminExists = await prisma.admin.findUnique({
    where: { email: "admin@bakalenx.com" },
  });

  if (!adminExists) {
    // In a real app, hash this! For demo purposes, plaintext is used since we're just building out the interface
    await prisma.admin.create({
      data: {
        email: "admin@bakalenx.com",
        password: "admin", // Simple password for demo
      },
    });
    console.log("Created default admin (admin@bakalenx.com / admin)");
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
