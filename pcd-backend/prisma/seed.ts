
import bcrypt from 'bcryptjs';
import { PrismaClient } from "@prisma/client";
import { seedDeficiencia } from "./seed-def";
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

  // Gere um hash de senha para usar nos testes (senha: 123456)
  const senhaHash = await bcrypt.hash('123456', 8);

  // Executa seed de deficiência
  const def = await seedDeficiencia();

  // Para usar os ids de tipos/subtipos/barreiras/acessibilidades, use def.tipos, def.subtipos, def.barreiras, def.acessibilidades

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