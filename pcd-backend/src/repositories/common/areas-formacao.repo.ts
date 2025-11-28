import { prisma } from '../../prismaClient';

// Debug helper: log availability of new models once
let logged = false;
function logModelsOnce() {
  if (logged) return;
  try {
    const keys = Object.keys(prisma);
    console.log('[AreasFormacaoRepo] Prisma models:', keys.filter(k => !k.startsWith('_')));
    // Check presence specifically
    // @ts-ignore
    if (!prisma.areaFormacao) console.error('[AreasFormacaoRepo] areaFormacao model missing on prisma client');
  } catch (e) {
    console.error('[AreasFormacaoRepo] Error logging prisma models', e);
  }
  logged = true;
}

export const AreasFormacaoRepo = {
  async listarTodas() {
    logModelsOnce();
    return prisma.areaFormacao.findMany({
      orderBy: { nome: 'asc' },
    });
  },

  async obterPorId(id: number) {
    logModelsOnce();
    return prisma.areaFormacao.findUnique({
      where: { id },
    });
  },

  async listarPorCandidato(candidatoId: number) {
    logModelsOnce();
    const vinculos = await prisma.candidatoAreaFormacao.findMany({
      where: { candidatoId },
      include: { area: true },
    });
      return vinculos.map((v: any) => v.area);
  },

  async vincularAreasCandidato(candidatoId: number, areaIds: number[]) {
    logModelsOnce();
    // Remove vínculos antigos
    await prisma.candidatoAreaFormacao.deleteMany({
      where: { candidatoId },
    });

    // Cria novos vínculos
    if (areaIds.length > 0) {
      await prisma.candidatoAreaFormacao.createMany({
        data: areaIds.map(areaId => ({ candidatoId, areaId })),
        skipDuplicates: true,
      });
    }

    return this.listarPorCandidato(candidatoId);
  },
};
