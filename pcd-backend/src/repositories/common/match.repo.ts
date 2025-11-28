import prisma from '../../prismaClient';

export const MatchRepo = {
  // fetch candidate basic profile (subtipos) and separately the candidate barriers
  async getCandidatoProfile(candidatoId: number) {
    const candidato = await prisma.candidato.findUnique({
      where: { id: candidatoId },
      include: {
        subtipos: { include: { subtipo: true } },
      },
    });

    const candidatoBarreiras = await prisma.candidatoSubtipoBarreira.findMany({
      where: { candidatoId },
      include: { barreira: true },
    });

    return { candidato, candidatoBarreiras };
  },

  // fetch all vagas with accepted subtipos and offered acessibilidades
  async listVagasWithRelations() {
    return prisma.vaga.findMany({
      where: {
        status: 'PUBLICADA'
      },
      include: {
        empresa: true,
        subtiposAceitos: { include: { subtipo: true } },
        acessibilidades: { include: { acessibilidade: true } },
      },
    });
  },

  // fetch mappings Barreira -> Acessibilidade for given barrier ids
  async listBarreiraAcessibilidadesForBarreiras(barreiraIds: number[]) {
    if (!barreiraIds || !barreiraIds.length) return [];
    return prisma.barreiraAcessibilidade.findMany({
      where: { barreiraId: { in: barreiraIds } },
    });
  },

  // fetch single vaga with relations
  async getVagaById(vagaId: number) {
    return prisma.vaga.findUnique({
      where: { id: vagaId },
      include: {
        empresa: true,
        subtiposAceitos: { include: { subtipo: true } },
        acessibilidades: { include: { acessibilidade: true } },
      },
    });
  },
};
