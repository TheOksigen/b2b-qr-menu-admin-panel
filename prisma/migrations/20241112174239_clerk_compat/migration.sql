/*
  Warnings:

  - You are about to drop the column `email` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Restaurant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Restaurant_email_key";

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "email",
DROP COLUMN "password";
