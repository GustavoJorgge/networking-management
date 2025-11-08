/*
  Warnings:

  - Added the required column `empresa` to the `membro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "membro" ADD COLUMN     "empresa" TEXT NOT NULL;
