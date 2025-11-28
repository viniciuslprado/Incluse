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
    "titulo" TEXT NOT NULL DEFAULT 'Vaga',
    "tipoContratacao" TEXT,
    "modeloTrabalho" TEXT,
    "localizacao" TEXT,
    "area" TEXT,
    "exigeMudanca" BOOLEAN DEFAULT false,
    "exigeViagens" BOOLEAN DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ativa',
    "escolaridade" TEXT,
    "cidade" TEXT DEFAULT 'A definir',
    "estado" TEXT DEFAULT 'A definir',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VagaDescricao" (
    "vagaId" INTEGER NOT NULL,
    "resumo" TEXT,
    "atividades" TEXT,
    "jornada" TEXT,
    "salarioMin" DOUBLE PRECISION,
    "salarioMax" DOUBLE PRECISION,

    CONSTRAINT "VagaDescricao_pkey" PRIMARY KEY ("vagaId")
);

-- CreateTable
CREATE TABLE "VagaRequisitos" (
    "vagaId" INTEGER NOT NULL,
    "formacao" TEXT,
    "experiencia" TEXT,
    "competencias" TEXT,
    "habilidadesTecnicas" TEXT,

    CONSTRAINT "VagaRequisitos_pkey" PRIMARY KEY ("vagaId")
);

-- CreateTable
CREATE TABLE "VagaBeneficio" (
    "id" SERIAL NOT NULL,
    "vagaId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "VagaBeneficio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VagaProcesso" (
    "id" SERIAL NOT NULL,
    "vagaId" INTEGER NOT NULL,
    "etapa" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VagaProcesso_pkey" PRIMARY KEY ("id")
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
    "curso" TEXT,
    "situacao" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "disponibilidadeGeografica" TEXT,
    "aceitaMudanca" BOOLEAN DEFAULT false,
    "aceitaViajar" BOOLEAN DEFAULT false,
    "pretensaoSalarialMin" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT,
    "senhaHash" TEXT,
    "curriculo" TEXT,
    "laudo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

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
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "VagaSalva_pkey" PRIMARY KEY ("candidatoId","vagaId")
);

-- CreateTable
CREATE TABLE "CandidatoVagaFavorita" (
    "candidatoId" INTEGER NOT NULL,
    "vagaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CandidatoVagaFavorita_pkey" PRIMARY KEY ("candidatoId","vagaId")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "acao" TEXT NOT NULL,
    "userId" INTEGER,
    "userType" TEXT,
    "detalhes" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidatoConfig" (
    "candidatoId" INTEGER NOT NULL,
    "emailNovasVagas" BOOLEAN NOT NULL DEFAULT true,
    "emailAtualizacoes" BOOLEAN NOT NULL DEFAULT true,
    "emailMensagens" BOOLEAN NOT NULL DEFAULT true,
    "emailCurriculoIncompleto" BOOLEAN NOT NULL DEFAULT true,
    "emailVagasExpiradas" BOOLEAN NOT NULL DEFAULT true,
    "appNovasVagas" BOOLEAN NOT NULL DEFAULT true,
    "appAtualizacoes" BOOLEAN NOT NULL DEFAULT true,
    "appMensagens" BOOLEAN NOT NULL DEFAULT true,
    "appCurriculoIncompleto" BOOLEAN NOT NULL DEFAULT true,
    "appVagasExpiradas" BOOLEAN NOT NULL DEFAULT true,
    "curriculoVisivel" BOOLEAN NOT NULL DEFAULT true,
    "idioma" TEXT NOT NULL DEFAULT 'pt-BR',
    "termosAceitos" BOOLEAN NOT NULL DEFAULT false,
    "termosAceitosEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidatoConfig_pkey" PRIMARY KEY ("candidatoId")
);

-- CreateTable
CREATE TABLE "Notificacao" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "vagaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidatoExperiencia" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "cargo" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "atual" BOOLEAN NOT NULL DEFAULT false,
    "descricao" TEXT,

    CONSTRAINT "CandidatoExperiencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidatoFormacao" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "escolaridade" TEXT NOT NULL,
    "instituicao" TEXT,
    "curso" TEXT,
    "situacao" TEXT,
    "dataInicio" TIMESTAMP(3),
    "dataFim" TIMESTAMP(3),

    CONSTRAINT "CandidatoFormacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidatoCurso" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "instituicao" TEXT NOT NULL,
    "cargaHoraria" INTEGER,
    "certificado" TEXT,

    CONSTRAINT "CandidatoCurso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidatoCompetencia" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,

    CONSTRAINT "CandidatoCompetencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidatoIdioma" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "idioma" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,
    "certificado" TEXT,

    CONSTRAINT "CandidatoIdioma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaFormacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AreaFormacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidatoAreaFormacao" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "areaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CandidatoAreaFormacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidatura" (
    "id" SERIAL NOT NULL,
    "vagaId" INTEGER NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "anotacoes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
CREATE INDEX "Vaga_empresaId_idx" ON "Vaga"("empresaId");

-- CreateIndex
CREATE INDEX "Vaga_status_idx" ON "Vaga"("status");

-- CreateIndex
CREATE INDEX "VagaBeneficio_vagaId_idx" ON "VagaBeneficio"("vagaId");

-- CreateIndex
CREATE INDEX "VagaProcesso_vagaId_idx" ON "VagaProcesso"("vagaId");

-- CreateIndex
CREATE UNIQUE INDEX "VagaProcesso_vagaId_ordem_key" ON "VagaProcesso"("vagaId", "ordem");

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

-- CreateIndex
CREATE INDEX "AuditLog_acao_idx" ON "AuditLog"("acao");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "Notificacao_candidatoId_idx" ON "Notificacao"("candidatoId");

-- CreateIndex
CREATE INDEX "Notificacao_lida_idx" ON "Notificacao"("lida");

-- CreateIndex
CREATE INDEX "CandidatoExperiencia_candidatoId_idx" ON "CandidatoExperiencia"("candidatoId");

-- CreateIndex
CREATE INDEX "CandidatoFormacao_candidatoId_idx" ON "CandidatoFormacao"("candidatoId");

-- CreateIndex
CREATE INDEX "CandidatoCurso_candidatoId_idx" ON "CandidatoCurso"("candidatoId");

-- CreateIndex
CREATE INDEX "CandidatoCompetencia_candidatoId_idx" ON "CandidatoCompetencia"("candidatoId");

-- CreateIndex
CREATE INDEX "CandidatoIdioma_candidatoId_idx" ON "CandidatoIdioma"("candidatoId");

-- CreateIndex
CREATE UNIQUE INDEX "AreaFormacao_nome_key" ON "AreaFormacao"("nome");

-- CreateIndex
CREATE INDEX "CandidatoAreaFormacao_candidatoId_idx" ON "CandidatoAreaFormacao"("candidatoId");

-- CreateIndex
CREATE INDEX "CandidatoAreaFormacao_areaId_idx" ON "CandidatoAreaFormacao"("areaId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidatoAreaFormacao_candidatoId_areaId_key" ON "CandidatoAreaFormacao"("candidatoId", "areaId");

-- CreateIndex
CREATE INDEX "Candidatura_vagaId_idx" ON "Candidatura"("vagaId");

-- CreateIndex
CREATE INDEX "Candidatura_candidatoId_idx" ON "Candidatura"("candidatoId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidatura_vagaId_candidatoId_key" ON "Candidatura"("vagaId", "candidatoId");

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
ALTER TABLE "VagaDescricao" ADD CONSTRAINT "VagaDescricao_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaRequisitos" ADD CONSTRAINT "VagaRequisitos_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaBeneficio" ADD CONSTRAINT "VagaBeneficio_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaProcesso" ADD CONSTRAINT "VagaProcesso_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "CandidatoVagaFavorita" ADD CONSTRAINT "CandidatoVagaFavorita_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoVagaFavorita" ADD CONSTRAINT "CandidatoVagaFavorita_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoConfig" ADD CONSTRAINT "CandidatoConfig_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoExperiencia" ADD CONSTRAINT "CandidatoExperiencia_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoFormacao" ADD CONSTRAINT "CandidatoFormacao_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoCurso" ADD CONSTRAINT "CandidatoCurso_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoCompetencia" ADD CONSTRAINT "CandidatoCompetencia_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoIdioma" ADD CONSTRAINT "CandidatoIdioma_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoAreaFormacao" ADD CONSTRAINT "CandidatoAreaFormacao_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoAreaFormacao" ADD CONSTRAINT "CandidatoAreaFormacao_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "AreaFormacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
