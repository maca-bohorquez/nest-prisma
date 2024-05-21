/*
  Warnings:

  - Added the required column `name` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('SUPERADMIN', 'GENERIC');

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "name" "RoleType" NOT NULL;
