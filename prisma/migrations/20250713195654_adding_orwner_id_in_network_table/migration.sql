/*
  Warnings:

  - The primary key for the `Network` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `owner_id` to the `Network` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_network_id_fkey";

-- AlterTable
ALTER TABLE "Network" DROP CONSTRAINT "Network_pkey",
ADD COLUMN     "owner_id" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Network_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Network_id_seq";

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "network_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_network_id_fkey" FOREIGN KEY ("network_id") REFERENCES "Network"("id") ON DELETE SET NULL ON UPDATE CASCADE;
