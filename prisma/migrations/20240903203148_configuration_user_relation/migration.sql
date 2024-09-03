/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `configurations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "configurations_user_id_key" ON "configurations"("user_id");
