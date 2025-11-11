import { prisma } from "./prisma";

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
      include: {
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
};
