/*
  Warnings:

  - You are about to drop the column `disponibilidadeGeografica` on the `Candidato` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidato" DROP COLUMN "disponibilidadeGeografica";

-- CreateTable
CREATE TABLE "NotificacaoEmpresa" (
    "id" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "vagaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificacaoEmpresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmpresaConfig" (
    "empresaId" INTEGER NOT NULL,
    "emailNovasCandidaturas" BOOLEAN NOT NULL DEFAULT true,
    "emailStatusProcesso" BOOLEAN NOT NULL DEFAULT true,
    "emailMensagens" BOOLEAN NOT NULL DEFAULT true,
    "appNovasCandidaturas" BOOLEAN NOT NULL DEFAULT true,
    "appStatusProcesso" BOOLEAN NOT NULL DEFAULT true,
    "appMensagens" BOOLEAN NOT NULL DEFAULT true,
    "idioma" TEXT NOT NULL DEFAULT 'pt-BR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmpresaConfig_pkey" PRIMARY KEY ("empresaId")
);

-- CreateIndex
CREATE INDEX "NotificacaoEmpresa_empresaId_idx" ON "NotificacaoEmpresa"("empresaId");

-- CreateIndex
CREATE INDEX "NotificacaoEmpresa_lida_idx" ON "NotificacaoEmpresa"("lida");

-- AddForeignKey
ALTER TABLE "NotificacaoEmpresa" ADD CONSTRAINT "NotificacaoEmpresa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificacaoEmpresa" ADD CONSTRAINT "NotificacaoEmpresa_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpresaConfig" ADD CONSTRAINT "EmpresaConfig_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
