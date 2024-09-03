/*
  Warnings:

  - You are about to drop the column `discountPercentage` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `finalPrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `manufactureDate` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `originalPrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `quantityInStock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `unitOfMeasure` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `validityInDays` on the `products` table. All the data in the column will be lost.
  - Added the required column `discount_percentage` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `due_date` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `final_price` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacture_date` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_price` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity_in_stock` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_of_measure` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validity_in_days` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "discountPercentage",
DROP COLUMN "finalPrice",
DROP COLUMN "manufactureDate",
DROP COLUMN "originalPrice",
DROP COLUMN "quantityInStock",
DROP COLUMN "unitOfMeasure",
DROP COLUMN "validityInDays",
ADD COLUMN     "discount_percentage" INTEGER NOT NULL,
ADD COLUMN     "due_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "final_price" INTEGER NOT NULL,
ADD COLUMN     "manufacture_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "original_price" INTEGER NOT NULL,
ADD COLUMN     "quantity_in_stock" INTEGER NOT NULL,
ADD COLUMN     "unit_of_measure" TEXT NOT NULL,
ADD COLUMN     "validity_in_days" INTEGER NOT NULL;
