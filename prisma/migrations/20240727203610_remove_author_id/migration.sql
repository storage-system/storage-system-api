/*
  Warnings:

  - You are about to drop the column `author_id` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_author_id_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "author_id",
ALTER COLUMN "manufactureDate" DROP NOT NULL;
