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
      nome: "TechInclusiva Ltda",
      cnpj: "12.345.678/0001-90",
      email: "rh@techinclusiva.com.br",
    }
  });

  const empresa2 = await prisma.empresa.create({
    data: {
      nome: "InnovaCorps",
      cnpj: "98.765.432/0001-10",
      email: "contato@innovacorps.com",
    }
  });

  // Vagas
  await prisma.vaga.createMany({
    data: [
      {
        empresaId: empresa1.id,
        descricao: "Desenvolvedor Frontend React/TypeScript",
        escolaridade: "Ensino Superior Completo"
      },
      {
        empresaId: empresa1.id,
        descricao: "Analista de Suporte Técnico",
        escolaridade: "Ensino Médio Completo"
      },
      {
        empresaId: empresa1.id,
        descricao: "Designer UX/UI",
        escolaridade: "Ensino Superior Completo"
      },
      {
        empresaId: empresa2.id,
        descricao: "Atendimento ao Cliente - Remoto",
        escolaridade: "Ensino Médio Completo"
      },
      {
        empresaId: empresa2.id,
        descricao: "Auxiliar Administrativo",
        escolaridade: "Ensino Médio Completo"
      },
      {
        empresaId: empresa2.id,
        descricao: "Analista de Dados Júnior",
        escolaridade: "Ensino Superior Incompleto"
      }
    ]
  });

  console.log("Seed concluído ✅");
  console.log("Empresas criadas:");
  console.log(`- ${empresa1.nome} (ID: ${empresa1.id})`);
  console.log(`- ${empresa2.nome} (ID: ${empresa2.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());