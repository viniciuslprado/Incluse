import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCandidatosVagas() {
  // Empresas para as vagas
  const empresa1 = await prisma.empresa.upsert({
    where: { id: 5 },
    update: {},
    create: { id: 5, nome: 'Empresa 1', email: 'empresa1@email.com' },
  });
  const empresa2 = await prisma.empresa.upsert({
    where: { id: 6 },
    update: {},
    create: { id: 6, nome: 'Empresa 2', email: 'empresa2@email.com' },
  });
  const empresa3 = await prisma.empresa.upsert({
    where: { id: 7 },
    update: {},
    create: { id: 7, nome: 'Empresa 3', email: 'empresa3@email.com' },
  });

  // Áreas de formação
  const areaAdministracao = await prisma.areaFormacao.upsert({
    where: { nome: 'Administração' },
    update: {},
    create: { nome: 'Administração' },
  });
  const areaLogistica = await prisma.areaFormacao.upsert({
    where: { nome: 'Logística' },
    update: {},
    create: { nome: 'Logística' },
  });
  const areaAtendimento = await prisma.areaFormacao.upsert({
    where: { nome: 'Atendimento' },
    update: {},
    create: { nome: 'Atendimento' },
  });
  console.log('IDs das áreas criadas:', {
    administracao: areaAdministracao.id,
    logistica: areaLogistica.id,
    atendimento: areaAtendimento.id,
  });

  // Candidatos
  await prisma.candidato.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nome: 'Fernando Moises',
      email: 'fernando@email.com',
      senhaHash: '$2a$10$Q9QwQwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQw', // senha: 123456
      escolaridade: 'Ensino Superior Completo',
      curso: 'Administração',
      cidade: 'São Paulo',
      estado: 'SP',
      aceitaMudanca: true,
      aceitaViajar: true,
    },
  });
  await prisma.candidato.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nome: 'Maria da Silva',
      email: 'maria@email.com',
      senhaHash: '$2a$10$Q9QwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', // senha: 123456
      escolaridade: 'Ensino Superior Completo',
      curso: 'Administração',
      cidade: 'Campinas',
      estado: 'SP',
      aceitaMudanca: true,
      aceitaViajar: true,
    },
  });
  await prisma.candidato.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      nome: 'João Souza',
      email: 'joao@email.com',
      senhaHash: '$2a$10$Q9QwQwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQw', // senha: 123456
      escolaridade: 'Ensino Médio Completo',
      curso: 'Logística',
      cidade: 'São Paulo',
      estado: 'SP',
      aceitaMudanca: false,
      aceitaViajar: false,
    },
  });

  // Associar candidatos às áreas de formação
  await prisma.candidatoAreaFormacao.upsert({
    where: { candidatoId_areaId: { candidatoId: 2, areaId: areaAdministracao.id } },
    update: {},
    create: { candidatoId: 2, areaId: areaAdministracao.id },
  });
  await prisma.candidatoAreaFormacao.upsert({
    where: { candidatoId_areaId: { candidatoId: 3, areaId: areaLogistica.id } },
    update: {},
    create: { candidatoId: 3, areaId: areaLogistica.id },
  });

  // Vagas
  await prisma.vaga.upsert({
    where: { id: 10 },
    update: {},
    create: {
      id: 10,
      empresaId: 5,
      titulo: 'Analista Administrativo',
      escolaridade: 'Ensino Superior Completo',
      cidade: 'São Paulo',
      estado: 'SP',
      areaId: areaAdministracao.id,
    },
  });
  await prisma.vaga.upsert({
    where: { id: 11 },
    update: {},
    create: {
      id: 11,
      empresaId: 6,
      titulo: 'Auxiliar de Logística',
      escolaridade: 'Ensino Médio Completo',
      cidade: 'Campinas',
      estado: 'SP',
      areaId: areaLogistica.id,
    },
  });
  await prisma.vaga.upsert({
    where: { id: 12 },
    update: {},
    create: {
      id: 12,
      empresaId: 7,
      titulo: 'Recepcionista',
      escolaridade: 'Ensino Médio Completo',
      cidade: 'Campinas',
      estado: 'SP',
      areaId: areaAtendimento.id,
    },
  });
}
