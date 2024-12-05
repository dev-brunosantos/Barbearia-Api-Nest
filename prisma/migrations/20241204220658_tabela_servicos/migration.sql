/*
  Warnings:

  - You are about to drop the column `prof_id` on the `servicos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "servicos" DROP CONSTRAINT "servicos_prof_id_fkey";

-- AlterTable
ALTER TABLE "servicos" DROP COLUMN "prof_id";
