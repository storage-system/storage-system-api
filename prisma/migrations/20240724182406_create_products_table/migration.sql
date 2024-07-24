-- CreateEnum
CREATE TYPE "StatusProduct" AS ENUM ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK');

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "productId" TEXT;

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "originalPrice" INTEGER NOT NULL,
    "finalPrice" INTEGER NOT NULL,
    "discountPercentage" INTEGER NOT NULL,
    "quantityInStock" INTEGER NOT NULL,
    "manufactureDate" TIMESTAMP(3) NOT NULL,
    "validityInDays" INTEGER NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "dimensions_height" TEXT NOT NULL,
    "dimensions_width" TEXT NOT NULL,
    "dimensions_depth" TEXT NOT NULL,
    "manufacturer" TEXT,
    "batch" TEXT,
    "status" "StatusProduct" NOT NULL,
    "company_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
