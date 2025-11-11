-- CreateTable
CREATE TABLE "Candidato" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "escolaridade" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidatoSubtipo" (
    "candidatoId" INTEGER NOT NULL,
    "subtipoId" INTEGER NOT NULL,

    CONSTRAINT "CandidatoSubtipo_pkey" PRIMARY KEY ("candidatoId","subtipoId")
);

-- CreateTable
CREATE TABLE "CandidatoSubtipoBarreira" (
    "candidatoId" INTEGER NOT NULL,
    "subtipoId" INTEGER NOT NULL,
    "barreiraId" INTEGER NOT NULL,

    CONSTRAINT "CandidatoSubtipoBarreira_pkey" PRIMARY KEY ("candidatoId","subtipoId","barreiraId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_email_key" ON "Candidato"("email");

-- CreateIndex
CREATE INDEX "CandidatoSubtipo_subtipoId_idx" ON "CandidatoSubtipo"("subtipoId");

-- CreateIndex
CREATE INDEX "CandidatoSubtipoBarreira_subtipoId_idx" ON "CandidatoSubtipoBarreira"("subtipoId");

-- CreateIndex
CREATE INDEX "CandidatoSubtipoBarreira_barreiraId_idx" ON "CandidatoSubtipoBarreira"("barreiraId");

-- AddForeignKey
ALTER TABLE "CandidatoSubtipo" ADD CONSTRAINT "CandidatoSubtipo_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoSubtipo" ADD CONSTRAINT "CandidatoSubtipo_subtipoId_fkey" FOREIGN KEY ("subtipoId") REFERENCES "SubtipoDeficiencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoSubtipoBarreira" ADD CONSTRAINT "CandidatoSubtipoBarreira_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoSubtipoBarreira" ADD CONSTRAINT "CandidatoSubtipoBarreira_subtipoId_fkey" FOREIGN KEY ("subtipoId") REFERENCES "SubtipoDeficiencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoSubtipoBarreira" ADD CONSTRAINT "CandidatoSubtipoBarreira_barreiraId_fkey" FOREIGN KEY ("barreiraId") REFERENCES "Barreira"("id") ON DELETE CASCADE ON UPDATE CASCADE;
