/*
  Warnings:

  - You are about to drop the column `CreatedAt` on the `Planet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Planet" DROP COLUMN "CreatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" VARCHAR(255),
ADD COLUMN     "updatedBy" VARCHAR(255);
