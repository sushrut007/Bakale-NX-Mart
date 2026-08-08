const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const { createClient } = require('@libsql/client');

async function main() {
  const libsql = createClient({ url: 'file:./dev.db' });
  const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
  const prisma = new PrismaClient({ adapter });

  console.log("Updating product images...");
  
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    const newImage = `https://picsum.photos/seed/${product.id}/800/1000`;
    const newImages = JSON.stringify([
      `https://picsum.photos/seed/${product.id}/800/1000`,
      `https://picsum.photos/seed/${product.id}_alt/800/1000`
    ]);

    await prisma.product.update({
      where: { id: product.id },
      data: {
        image: newImage,
        images: newImages
      }
    });
  }

  console.log(`Updated images for ${products.length} products.`);
  await prisma.$disconnect();
}

main().catch(console.error);
