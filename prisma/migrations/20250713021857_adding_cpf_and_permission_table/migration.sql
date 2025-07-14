/*
  Warnings:

  - The primary key for the `UserStorePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `permissions` on the `UserStorePermission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `permission_id` to the `UserStorePermission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('superadmin', 'admin', 'employee');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cpf" VARCHAR(14),
ADD COLUMN     "phone" VARCHAR(20),
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- AlterTable
ALTER TABLE "UserStorePermission" DROP CONSTRAINT "UserStorePermission_pkey",
DROP COLUMN "permissions",
ADD COLUMN     "permission_id" INTEGER NOT NULL,
ADD CONSTRAINT "UserStorePermission_pkey" PRIMARY KEY ("user_id", "store_id", "permission_id");

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- AddForeignKey
ALTER TABLE "UserStorePermission" ADD CONSTRAINT "UserStorePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
