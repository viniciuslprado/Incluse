-- CreateTable
CREATE TABLE "EmpresaConfig" (
    "id" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "emailNovaCandidatura" BOOLEAN NOT NULL DEFAULT true,
    "emailStatusProcesso" BOOLEAN NOT NULL DEFAULT true,
    "emailMensagensCandidatos" BOOLEAN NOT NULL DEFAULT false,
    "alertasVagasExpirando" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmpresaConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmpresaConfig_empresaId_key" ON "EmpresaConfig"("empresaId");

-- AddForeignKey
ALTER TABLE "EmpresaConfig" ADD CONSTRAINT "EmpresaConfig_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
