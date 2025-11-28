import prisma from '../../prismaClient';
export const ProcessoSeletivoRepo = {
  async getEtapasVaga(vagaId: number) {
    return prisma.vagaProcesso.findMany({
      where: { vagaId },
      orderBy: { ordem: 'asc' }
    });
  },

  async getCandidatosPorEtapa(vagaId: number) {
    // Campo 'etapa' e 'avaliacao' não existem em Candidatura
    // Retornando agrupamento por status como alternativa
    return prisma.candidatura.groupBy({
      by: ['status'],
      where: { vagaId },
      _count: { id: true }
    });
  },

  async findCandidatura(vagaId: number, candidatoId: number) {
    return prisma.candidatura.findUnique({
      where: { vagaId_candidatoId: { vagaId, candidatoId } }
    });
  },

  async updateEtapa(vagaId: number, candidatoId: number, novaEtapa: string, etapaAnterior?: string, usuarioId?: number) {
    // Atualizando status ao invés de etapa (campo não existe)
    return prisma.candidatura.update({
      where: { vagaId_candidatoId: { vagaId, candidatoId } },
      data: { status: novaEtapa }
    });
  },

  async updateAvaliacao(vagaId: number, candidatoId: number, avaliacao: number, observacoes?: string, usuarioId?: number) {
    // Campo avaliacao não existe em Candidatura
    // Atualizando apenas anotacoes se fornecidas
    return prisma.candidatura.update({
      where: { vagaId_candidatoId: { vagaId, candidatoId } },
      data: observacoes ? { anotacoes: observacoes } : {}
    });
  },

  async getCandidatosPorStatus(vagaId: number) {
    const statusGroups = await prisma.candidatura.groupBy({
      by: ['status'],
      where: { vagaId },
      _count: { id: true }
    });

    const candidatosPorStatus: any = {};
    
    for (const group of statusGroups) {
      const candidatos = await prisma.candidatura.findMany({
        where: { vagaId, status: group.status },
        include: {
          candidato: {
            select: {
              id: true,
              nome: true,
              email: true,
              escolaridade: true,
              subtipos: {
                include: {
                  subtipo: { select: { nome: true } }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      candidatosPorStatus[group.status] = candidatos;
    }

    return candidatosPorStatus;
  },
};