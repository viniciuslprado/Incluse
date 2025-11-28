import prisma from '../../prismaClient';

export async function getCandidatoConfig(candidatoId: number) {
  if (!candidatoId || isNaN(candidatoId)) {
    throw new Error('ID do candidato inválido');
  }
  
  let config = await prisma.candidatoConfig.findUnique({
    where: { candidatoId }
  });
  
  // Se não existir, criar com valores padrão (termos aceitos na criação da conta)
  if (!config) {
    const candidato = await prisma.candidato.findUnique({
      where: { id: candidatoId },
      select: { createdAt: true }
    });
    
    config = await prisma.candidatoConfig.create({
      data: { 
        candidatoId,
        termosAceitos: true,
        termosAceitosEm: candidato?.createdAt || new Date()
      }
    });
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
