/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Candidato` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Candidato" ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "senhaHash" TEXT;

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "senhaHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_cpf_key" ON "Candidato"("cpf");
