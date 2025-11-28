import bcrypt from 'bcryptjs';

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    // Seed do admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Administrador';
    if (adminEmail && adminPassword) {
      const senhaHash = await bcrypt.hash(adminPassword, 10);
      await prisma.administrador.upsert({
        where: { email: adminEmail },
        update: { senhaHash, nome: adminName, isActive: true },
        create: { email: adminEmail, senhaHash, nome: adminName, isActive: true },
      });
      console.log('👑 Administrador inserido/atualizado:', adminEmail);
    } else {
      console.warn('⚠️ Variáveis ADMIN_EMAIL e ADMIN_PASSWORD não definidas no .env. Admin não criado.');
    }
  // limpa dados (apenas para desenvolvimento)
  await prisma.vaga.deleteMany();
  await prisma.empresa.deleteMany();
  // limpar tabelas relacionadas a candidatos (evita erro de unique cpf)
  await prisma.candidatoSubtipoBarreira.deleteMany();
  await prisma.candidatoSubtipo.deleteMany();
  await prisma.candidato.deleteMany();
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
  await prisma.$executeRaw`ALTER SEQUENCE "Candidato_id_seq" RESTART WITH 1`;
  
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

  // Gere um hash de senha para usar nos testes (senha: 123456)
  const senhaHash = await bcrypt.hash('123456', 8);

  // Empresas
  const empresa1 = await prisma.empresa.create({
    data: {
      nome: "TechInclusiva - Tecnologia Acessível",
      cnpj: "12345678000190",
      email: "rh@techinclusiva.com.br",
      senhaHash: senhaHash, // Adiciona a senha
    }
  });

  const empresa2 = await prisma.empresa.create({
    data: {
      nome: "InnovaCorps - Inovação Inclusiva",
      cnpj: "98765432000110",
      email: "inclusao@innovacorps.com",
      senhaHash: senhaHash, // Adiciona a senha
    }
  });

  const empresa3 = await prisma.empresa.create({
    data: {
      nome: "AcessoTotal Consultoria",
      cnpj: "11222333000144",
      email: "vagas@acessototal.com.br",
      senhaHash: senhaHash, // Adiciona a senha
    }
  });

  // Vagas com descrições mais detalhadas
  // Criar vagas com estrutura completa
  const vaga1 = await prisma.vaga.create({
    data: {
      empresaId: empresa1.id,
      titulo: "Desenvolvedor Frontend React/TypeScript",
      tipoContratacao: "CLT",
      modeloTrabalho: "Remoto",
      localizacao: "São Paulo/SP",
      area: "Tecnologia da Informação",
      escolaridade: "Ensino Superior Completo",
      cidade: "São Paulo",
      estado: "SP",
      status: "ativa",
      descricaoVaga: {
        create: {
          resumo: "Desenvolvimento de interfaces acessíveis para plataforma web",
          atividades: "Desenvolver componentes React, implementar acessibilidade, trabalhar com TypeScript",
          jornada: "40 horas semanais",
          salarioMin: 5000,
          salarioMax: 8000
        }
      },
      requisitos: {
        create: {
          formacao: "Superior completo em TI ou áreas correlatas",
          experiencia: "2 anos com React e TypeScript",
          competencias: "Trabalho em equipe, Comunicação, Proatividade",
          habilidadesTecnicas: "React, TypeScript, HTML, CSS, Git"
        }
      },
      beneficios: {
        createMany: {
          data: [
            { descricao: "Vale refeição" },
            { descricao: "Vale transporte" },
            { descricao: "Plano de saúde" },
            { descricao: "Home office" }
          ]
        }
      },
      processos: {
        createMany: {
          data: [
            { etapa: "Triagem de currículos", ordem: 1 },
            { etapa: "Entrevista com RH", ordem: 2 },
            { etapa: "Teste técnico", ordem: 3 },
            { etapa: "Entrevista técnica", ordem: 4 },
            { etapa: "Proposta", ordem: 5 }
          ]
        }
      }
    }
  });

  const vaga2 = await prisma.vaga.create({
    data: {
      empresaId: empresa2.id,
      titulo: "Assistente Administrativo",
      tipoContratacao: "CLT",
      modeloTrabalho: "Presencial",
      localizacao: "São Paulo/SP",
      area: "Administrativo",
      escolaridade: "Ensino Médio Completo",
      cidade: "São Paulo",
      estado: "SP",
      status: "ativa",
      descricaoVaga: {
        create: {
          resumo: "Suporte administrativo geral",
          atividades: "Atendimento telefônico, organização de documentos, apoio administrativo",
          jornada: "44 horas semanais",
          salarioMin: 2000,
          salarioMax: 3000
        }
      },
      beneficios: {
        createMany: {
          data: [
            { descricao: "Vale refeição" },
            { descricao: "Vale transporte" }
          ]
        }
      }
    }
  });

  // Vincular acessibilidades às vagas
  await prisma.vagaAcessibilidade.createMany({
    data: [
      // Vaga 1 (Frontend Remoto) - Acessibilidades de comunicação
      { vagaId: vaga1.id, acessibilidadeId: chatInterno.id },
      
      // Vaga 2 (Administrativo Presencial) - Acessibilidades físicas
      { vagaId: vaga2.id, acessibilidadeId: rampa.id },
      { vagaId: vaga2.id, acessibilidadeId: elevador.id },
      { vagaId: vaga2.id, acessibilidadeId: pisoAntid.id },
    ],
    skipDuplicates: true,
  });

  // Vincular subtipos aceitos às vagas
  await prisma.vagaSubtipo.createMany({
    data: [
      // Vaga 1 aceita todos os subtipos
      { vagaId: vaga1.id, subtipoId: sub_motora1.id },
      { vagaId: vaga1.id, subtipoId: sub_auditiva1.id },
      { vagaId: vaga1.id, subtipoId: sub_visual1.id },
      
      // Vaga 2 aceita todos os subtipos
      { vagaId: vaga2.id, subtipoId: sub_motora1.id },
      { vagaId: vaga2.id, subtipoId: sub_auditiva1.id },
      { vagaId: vaga2.id, subtipoId: sub_visual1.id },
    ],
    skipDuplicates: true,
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
      senhaHash: senhaHash, // Adiciona a senha
      email: "joao@teste.com" // Adiciona email para login
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