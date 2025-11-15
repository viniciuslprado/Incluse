import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // limpa dados (apenas para desenvolvimento)
  await prisma.vaga.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.subtipoBarreira.deleteMany();
  await prisma.barreiraAcessibilidade.deleteMany();
  await prisma.acessibilidade.deleteMany();
  await prisma.barreira.deleteMany();
  await prisma.subtipoDeficiencia.deleteMany();
  await prisma.tipoDeficiencia.deleteMany();

  // Reset auto-increment sequences (PostgreSQL)
  await prisma.$executeRaw`ALTER SEQUENCE "TipoDeficiencia_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "SubtipoDeficiencia_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Barreira_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Acessibilidade_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Empresa_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Vaga_id_seq" RESTART WITH 1`;
  
  console.log("🗑️ Dados limpos e contadores resetados");

  // Tipos
  const motora = await prisma.tipoDeficiencia.create({
    data: { nome: "Deficiência Motora" },
  });
  const auditiva = await prisma.tipoDeficiencia.create({
    data: { nome: "Deficiência Auditiva" },
  });
  const visual = await prisma.tipoDeficiencia.create({
    data: { nome: "Deficiência Visual" },
  });

  // Subtipos
  const sub_motora1 = await prisma.subtipoDeficiencia.create({
    data: { nome: "Amputação MIE com muleta", tipoId: motora.id },
  });
  const sub_auditiva1 = await prisma.subtipoDeficiencia.create({
    data: { nome: "Usuário de Libras", tipoId: auditiva.id },
  });
  const sub_visual1 = await prisma.subtipoDeficiencia.create({
    data: { nome: "Baixa visão", tipoId: visual.id },
  });

  // Barreiras
  const [escadas, degrausAltos, pisoIrregular, faltaInterprete, comunicacaoOral, faltaContraste, faltaSinalizacaoTatil] =
    await prisma.$transaction([
      prisma.barreira.create({ data: { descricao: "Escadas" } }),
      prisma.barreira.create({ data: { descricao: "Degraus altos" } }),
      prisma.barreira.create({ data: { descricao: "Piso irregular" } }),
      prisma.barreira.create({ data: { descricao: "Ausência de intérprete de Libras" } }),
      prisma.barreira.create({ data: { descricao: "Dificuldade de comunicação oral" } }),
      prisma.barreira.create({ data: { descricao: "Falta de contraste visual" } }),
      prisma.barreira.create({ data: { descricao: "Falta de sinalização tátil" } }),
    ]);

  // Acessibilidades
  const [rampa, pisoAntid, elevador, interprete, chatInterno, altoContraste, pisoGuia] =
    await prisma.$transaction([
      prisma.acessibilidade.create({ data: { descricao: "Rampa com inclinação adequada" } }),
      prisma.acessibilidade.create({ data: { descricao: "Piso antiderrapante" } }),
      prisma.acessibilidade.create({ data: { descricao: "Elevador / acesso em nível" } }),
      prisma.acessibilidade.create({ data: { descricao: "Intérprete de Libras" } }),
      prisma.acessibilidade.create({ data: { descricao: "Comunicação por chat interno" } }),
      prisma.acessibilidade.create({ data: { descricao: "Sinalização de alto contraste" } }),
      prisma.acessibilidade.create({ data: { descricao: "Piso guia / sinalização tátil" } }),
    ]);

  // Subtipo ↔ Barreiras (N:N)
  await prisma.subtipoBarreira.createMany({
    data: [
      { subtipoId: sub_motora1.id, barreiraId: escadas.id },
      { subtipoId: sub_motora1.id, barreiraId: degrausAltos.id },
      { subtipoId: sub_motora1.id, barreiraId: pisoIrregular.id },

      { subtipoId: sub_auditiva1.id, barreiraId: comunicacaoOral.id },
      { subtipoId: sub_auditiva1.id, barreiraId: faltaInterprete.id },

      { subtipoId: sub_visual1.id, barreiraId: pisoIrregular.id },
      { subtipoId: sub_visual1.id, barreiraId: faltaContraste.id },
      { subtipoId: sub_visual1.id, barreiraId: faltaSinalizacaoTatil.id },
    ],
    skipDuplicates: true,
  });

  // Barreira ↔ Acessibilidade (N:N)
  await prisma.barreiraAcessibilidade.createMany({
    data: [
      // Motora
      { barreiraId: escadas.id, acessibilidadeId: rampa.id },
      { barreiraId: escadas.id, acessibilidadeId: elevador.id },
      { barreiraId: degrausAltos.id, acessibilidadeId: rampa.id },
      { barreiraId: degrausAltos.id, acessibilidadeId: elevador.id },
      { barreiraId: pisoIrregular.id, acessibilidadeId: pisoAntid.id },

      // Auditiva
      { barreiraId: faltaInterprete.id, acessibilidadeId: interprete.id },
      { barreiraId: comunicacaoOral.id, acessibilidadeId: chatInterno.id },

      // Visual
      { barreiraId: faltaContraste.id, acessibilidadeId: altoContraste.id },
      { barreiraId: faltaSinalizacaoTatil.id, acessibilidadeId: pisoGuia.id },
    ],
    skipDuplicates: true,
  });

  // Empresas
  const empresa1 = await prisma.empresa.create({
    data: {
      nome: "TechInclusiva - Tecnologia Acessível",
      cnpj: "12.345.678/0001-90",
      email: "rh@techinclusiva.com.br",
    }
  });

  const empresa2 = await prisma.empresa.create({
    data: {
      nome: "InnovaCorps - Inovação Inclusiva",
      cnpj: "98.765.432/0001-10",
      email: "inclusao@innovacorps.com",
    }
  });

  const empresa3 = await prisma.empresa.create({
    data: {
      nome: "AcessoTotal Consultoria",
      cnpj: "11.222.333/0001-44",
      email: "vagas@acessototal.com.br",
    }
  });

  // Vagas com descrições mais detalhadas
  await prisma.vaga.createMany({
    data: [
      // TechInclusiva - Vagas de tecnologia inclusiva
      {
        empresaId: empresa1.id,
        descricao: "Desenvolvedor Frontend React/TypeScript - Trabalho remoto com foco em acessibilidade web. Desenvolvimento de interfaces inclusivas seguindo padrões WCAG. Conhecimentos em screen readers e navegação por teclado são um diferencial.",
        escolaridade: "Ensino Superior Completo"
      },
      {
        empresaId: empresa1.id,
        descricao: "Analista de Suporte Técnico - Atendimento especializado para pessoas com deficiência. Ambiente de trabalho adaptado com tecnologias assistivas. Horário flexível e possibilidade de home office.",
        escolaridade: "Ensino Médio Completo"
      },
      {
        empresaId: empresa1.id,
        descricao: "Designer UX/UI Inclusivo - Criação de interfaces acessíveis e inclusivas. Conhecimento em design universal, contraste de cores, e usabilidade para pessoas com deficiência. Trabalho híbrido.",
        escolaridade: "Ensino Superior Completo"
      },
      {
        empresaId: empresa1.id,
        descricao: "Especialista em Testes de Acessibilidade - Responsável por garantir que nossos produtos sejam acessíveis. Experiência com ferramentas de teste de acessibilidade e conhecimento em WCAG 2.1.",
        escolaridade: "Ensino Superior Completo"
      },
      {
        empresaId: empresa1.id,
        descricao: "Tradutor e Intérprete de Libras - Atuação em reuniões, treinamentos e eventos da empresa. Certificação em Libras é obrigatória. Ambiente colaborativo e inclusivo.",
        escolaridade: "Ensino Superior Completo"
      },

      // InnovaCorps - Vagas corporativas inclusivas  
      {
        empresaId: empresa2.id,
        descricao: "Atendimento ao Cliente - Remoto com Libras - Canal especializado para atendimento em Libras via videochamada. Conhecimento em Libras obrigatório. Treinamento completo fornecido pela empresa.",
        escolaridade: "Ensino Médio Completo"
      },
      {
        empresaId: empresa2.id,
        descricao: "Auxiliar Administrativo - Escritório adaptado com elevador, rampas e banheiros acessíveis. Softwares com leitores de tela disponíveis. Horário flexível de 6h diárias.",
        escolaridade: "Ensino Médio Completo"
      },
      {
        empresaId: empresa2.id,
        descricao: "Analista de Dados Júnior - Trabalho com Excel, Power BI e análise de métricas de inclusão. Ambiente 100% acessível com tecnologias assistivas. Mentoria especializada.",
        escolaridade: "Ensino Superior Incompleto"
      },
      {
        empresaId: empresa2.id,
        descricao: "Coordenador de Diversidade e Inclusão - Desenvolvimento de políticas inclusivas, treinamentos de sensibilização e acompanhamento de colaboradores PcD. Experiência em RH desejável.",
        escolaridade: "Ensino Superior Completo"
      },
      {
        empresaId: empresa2.id,
        descricao: "Operador de Telemarketing Adaptado - Call center com equipamentos adaptados, software de ampliação de tela e teclados especiais. Treinamento em comunicação inclusiva.",
        escolaridade: "Ensino Médio Completo"
      },
      {
        empresaId: empresa2.id,
        descricao: "Assistente de Marketing Digital - Criação de conteúdo inclusivo para redes sociais, campanhas de conscientização sobre acessibilidade. Conhecimento em Canva e redes sociais.",
        escolaridade: "Ensino Médio Completo"
      },

      // AcessoTotal - Consultoria especializada
      {
        empresaId: empresa3.id,
        descricao: "Consultor em Acessibilidade Arquitetônica - Análise e adequação de espaços físicos conforme NBR 9050. Formação em Arquitetura ou Engenharia. Conhecimento em legislação de acessibilidade.",
        escolaridade: "Ensino Superior Completo"
      },
      {
        empresaId: empresa3.id,
        descricao: "Instrutor de Libras - Ministrar cursos de Libras para empresas e instituições. Certificação Prolibras obrigatória. Experiência em ensino é um diferencial.",
        escolaridade: "Ensino Superior Completo"
      },
      {
        empresaId: empresa3.id,
        descricao: "Terapeuta Ocupacional - Avaliação e adaptação de postos de trabalho. Prescrição de tecnologias assistivas. Acompanhamento de funcionários PcD em empresas clientes.",
        escolaridade: "Ensino Superior Completo"
      },
      {
        empresaId: empresa3.id,
        descricao: "Assistente Administrativo - Apoio em projetos de consultoria, organização de documentos e agendamentos. Ambiente totalmente acessível com estação de trabalho adaptável.",
        escolaridade: "Ensino Médio Completo"
      }
    ]
  });

  console.log("Seed concluído ✅");
  console.log("Empresas criadas:");
  console.log(`- ${empresa1.nome} (ID: ${empresa1.id})`);
  console.log(`- ${empresa2.nome} (ID: ${empresa2.id})`);
  console.log(`- ${empresa3.nome} (ID: ${empresa3.id})`);
  console.log("\n🎯 Acesse as vagas em:");
  console.log(`http://localhost:5173/empresa/${empresa1.id}/vagas`);
  console.log(`http://localhost:5173/empresa/${empresa2.id}/vagas`);
  console.log(`http://localhost:5173/empresa/${empresa3.id}/vagas`);

  // --- Candidato de teste (para verificar match)
  const candidato1 = await prisma.candidato.create({
    data: {
      nome: "João Teste",
      cpf: "111.222.333-44",
      telefone: "(11) 99999-0000",
      escolaridade: "Ensino Médio Completo",
    },
  });

  // vincula subtipo motora ao candidato
  await prisma.candidatoSubtipo.create({ data: { candidatoId: candidato1.id, subtipoId: sub_motora1.id } });

  // vincula barreiras enfrentadas pelo candidato para esse subtipo (ex.: escadas e degrausAltos)
  await prisma.candidatoSubtipoBarreira.createMany({
    data: [
      { candidatoId: candidato1.id, subtipoId: sub_motora1.id, barreiraId: escadas.id },
      { candidatoId: candidato1.id, subtipoId: sub_motora1.id, barreiraId: degrausAltos.id },
    ],
    skipDuplicates: true,
  });

  console.log(`\nCandidato de teste criado: ${candidato1.nome} (ID: ${candidato1.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());