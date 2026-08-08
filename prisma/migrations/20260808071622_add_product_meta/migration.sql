-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "originalPrice" REAL,
    "image" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "isCutPiece" BOOLEAN NOT NULL DEFAULT false,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "availableSizes" TEXT,
    "tags" TEXT,
    "rating" REAL NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "isBestseller" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("availableSizes", "brand", "category", "createdAt", "description", "features", "id", "image", "images", "inStock", "isBestseller", "isCutPiece", "isNew", "name", "originalPrice", "price", "updatedAt") SELECT "availableSizes", "brand", "category", "createdAt", "description", "features", "id", "image", "images", "inStock", "isBestseller", "isCutPiece", "isNew", "name", "originalPrice", "price", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
