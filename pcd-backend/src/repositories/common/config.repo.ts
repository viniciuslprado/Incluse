import prisma from '../../prismaClient';

export async function getCandidatoConfig(candidatoId: number) {
  if (!candidatoId || isNaN(candidatoId)) {
    throw new Error('ID do candidato inválido');
  }
  
  let config = await prisma.candidatoConfig.findUnique({
    where: { candidatoId }
  });

  // Se não existir, retorna objeto padrão (NÃO cria no banco, apenas retorna para o frontend)
  if (!config) {
    const candidato = await prisma.candidato.findUnique({
      where: { id: candidatoId },
      select: { createdAt: true }
    });
    const now = new Date();
    return {
      candidatoId,
      emailNovasVagas: true,
      emailAtualizacoes: true,
      emailMensagens: true,
      emailCurriculoIncompleto: true,
      emailVagasExpiradas: true,
      appNovasVagas: true,
      appAtualizacoes: true,
      appMensagens: true,
      appCurriculoIncompleto: true,
      appVagasExpiradas: true,
      curriculoVisivel: true,
      idioma: "pt-BR",
      termosAceitos: true,
      termosAceitosEm: candidato?.createdAt || now,
      createdAt: candidato?.createdAt || now,
      updatedAt: now
    };
  }
  return config;
}

export async function updateCandidatoConfig(candidatoId: number, data: any) {
  return await prisma.candidatoConfig.upsert({
    where: { candidatoId },
    create: {
      candidatoId,
      ...data
    },
    update: data
  });
}

export async function aceitarTermos(candidatoId: number) {
  return await prisma.candidatoConfig.upsert({
    where: { candidatoId },
    create: {
      candidatoId,
      termosAceitos: true,
      termosAceitosEm: new Date()
    },
    update: {
      termosAceitos: true,
      termosAceitosEm: new Date()
    }
  });
}

export async function desativarConta(candidatoId: number) {
  return await prisma.candidato.update({
    where: { id: candidatoId },
    data: { isActive: false }
  });
}

export async function excluirConta(candidatoId: number) {
  // Deleta em cascata graças ao schema
  return await prisma.candidato.delete({
    where: { id: candidatoId }
  });
}
