-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "cnpj" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "senhaHash" TEXT,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoDeficiencia" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoDeficiencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubtipoDeficiencia" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubtipoDeficiencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barreira" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Barreira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acessibilidade" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Acessibilidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubtipoBarreira" (
    "subtipoId" INTEGER NOT NULL,
    "barreiraId" INTEGER NOT NULL,

    CONSTRAINT "SubtipoBarreira_pkey" PRIMARY KEY ("subtipoId","barreiraId")
);

-- CreateTable
CREATE TABLE "BarreiraAcessibilidade" (
    "barreiraId" INTEGER NOT NULL,
    "acessibilidadeId" INTEGER NOT NULL,

    CONSTRAINT "BarreiraAcessibilidade_pkey" PRIMARY KEY ("barreiraId","acessibilidadeId")
);

-- CreateTable
CREATE TABLE "Vaga" (
    "id" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "escolaridade" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cidade" TEXT DEFAULT 'A definir',
    "estado" TEXT DEFAULT 'A definir',
    "titulo" TEXT DEFAULT 'Vaga',

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VagaSubtipo" (
    "vagaId" INTEGER NOT NULL,
    "subtipoId" INTEGER NOT NULL,

    CONSTRAINT "VagaSubtipo_pkey" PRIMARY KEY ("vagaId","subtipoId")
);

-- CreateTable
CREATE TABLE "VagaAcessibilidade" (
    "vagaId" INTEGER NOT NULL,
    "acessibilidadeId" INTEGER NOT NULL,

    CONSTRAINT "VagaAcessibilidade_pkey" PRIMARY KEY ("vagaId","acessibilidadeId")
);

-- CreateTable
CREATE TABLE "Candidato" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "escolaridade" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT,
    "senhaHash" TEXT,

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

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "anonimato" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VagaSalva" (
    "candidatoId" INTEGER NOT NULL,
    "vagaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VagaSalva_pkey" PRIMARY KEY ("candidatoId","vagaId")
);

-- CreateTable
CREATE TABLE "Candidatura" (
    "id" SERIAL NOT NULL,
    "vagaId" INTEGER NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidatura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_email_key" ON "Empresa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "TipoDeficiencia_nome_key" ON "TipoDeficiencia"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "SubtipoDeficiencia_tipoId_nome_key" ON "SubtipoDeficiencia"("tipoId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "Barreira_descricao_key" ON "Barreira"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Acessibilidade_descricao_key" ON "Acessibilidade"("descricao");

-- CreateIndex
CREATE INDEX "SubtipoBarreira_barreiraId_idx" ON "SubtipoBarreira"("barreiraId");

-- CreateIndex
CREATE INDEX "BarreiraAcessibilidade_acessibilidadeId_idx" ON "BarreiraAcessibilidade"("acessibilidadeId");

-- CreateIndex
CREATE INDEX "VagaSubtipo_subtipoId_idx" ON "VagaSubtipo"("subtipoId");

-- CreateIndex
CREATE INDEX "VagaAcessibilidade_acessibilidadeId_idx" ON "VagaAcessibilidade"("acessibilidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_email_key" ON "Candidato"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_cpf_key" ON "Candidato"("cpf");

-- CreateIndex
CREATE INDEX "CandidatoSubtipo_subtipoId_idx" ON "CandidatoSubtipo"("subtipoId");

-- CreateIndex
CREATE INDEX "CandidatoSubtipoBarreira_subtipoId_idx" ON "CandidatoSubtipoBarreira"("subtipoId");

-- CreateIndex
CREATE INDEX "CandidatoSubtipoBarreira_barreiraId_idx" ON "CandidatoSubtipoBarreira"("barreiraId");

-- AddForeignKey
ALTER TABLE "SubtipoDeficiencia" ADD CONSTRAINT "SubtipoDeficiencia_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoDeficiencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubtipoBarreira" ADD CONSTRAINT "SubtipoBarreira_barreiraId_fkey" FOREIGN KEY ("barreiraId") REFERENCES "Barreira"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubtipoBarreira" ADD CONSTRAINT "SubtipoBarreira_subtipoId_fkey" FOREIGN KEY ("subtipoId") REFERENCES "SubtipoDeficiencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarreiraAcessibilidade" ADD CONSTRAINT "BarreiraAcessibilidade_acessibilidadeId_fkey" FOREIGN KEY ("acessibilidadeId") REFERENCES "Acessibilidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarreiraAcessibilidade" ADD CONSTRAINT "BarreiraAcessibilidade_barreiraId_fkey" FOREIGN KEY ("barreiraId") REFERENCES "Barreira"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaga" ADD CONSTRAINT "Vaga_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaSubtipo" ADD CONSTRAINT "VagaSubtipo_subtipoId_fkey" FOREIGN KEY ("subtipoId") REFERENCES "SubtipoDeficiencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaSubtipo" ADD CONSTRAINT "VagaSubtipo_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaAcessibilidade" ADD CONSTRAINT "VagaAcessibilidade_acessibilidadeId_fkey" FOREIGN KEY ("acessibilidadeId") REFERENCES "Acessibilidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaAcessibilidade" ADD CONSTRAINT "VagaAcessibilidade_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoSubtipo" ADD CONSTRAINT "CandidatoSubtipo_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoSubtipo" ADD CONSTRAINT "CandidatoSubtipo_subtipoId_fkey" FOREIGN KEY ("subtipoId") REFERENCES "SubtipoDeficiencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoSubtipoBarreira" ADD CONSTRAINT "CandidatoSubtipoBarreira_barreiraId_fkey" FOREIGN KEY ("barreiraId") REFERENCES "Barreira"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoSubtipoBarreira" ADD CONSTRAINT "CandidatoSubtipoBarreira_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoSubtipoBarreira" ADD CONSTRAINT "CandidatoSubtipoBarreira_subtipoId_fkey" FOREIGN KEY ("subtipoId") REFERENCES "SubtipoDeficiencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaSalva" ADD CONSTRAINT "VagaSalva_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaSalva" ADD CONSTRAINT "VagaSalva_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
