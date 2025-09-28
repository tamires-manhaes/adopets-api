/*
  Warnings:

  - You are about to drop the column `product_id` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Sale` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_product_id_fkey";

-- DropIndex
DROP INDEX "idx_product_id_sale";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "product_id",
DROP COLUMN "quantity";

-- CreateTable
CREATE TABLE "ProductSale" (
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ProductSale_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "_ProductSaleToSale" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductSaleToSale_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductSale_product_id_key" ON "ProductSale"("product_id");

-- CreateIndex
CREATE INDEX "_ProductSaleToSale_B_index" ON "_ProductSaleToSale"("B");

-- AddForeignKey
ALTER TABLE "_ProductSaleToSale" ADD CONSTRAINT "_ProductSaleToSale_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductSale"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSaleToSale" ADD CONSTRAINT "_ProductSaleToSale_B_fkey" FOREIGN KEY ("B") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
