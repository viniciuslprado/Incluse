import prisma from '../../prismaClient';

export const NotificacoesRepo = {
  getNotificacoes(candidatoId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return prisma.notificacao.findMany({
      where: { candidatoId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        vaga: {
          select: {
            id: true,
            titulo: true,
            status: true,
            empresa: { select: { nome: true } }
          }
        }
      }
    });
  },

  countNotificacoes(candidatoId: number) {
    return prisma.notificacao.count({ where: { candidatoId } });
  },

  countNaoLidas(candidatoId: number) {
    return prisma.notificacao.count({ 
      where: { candidatoId, lida: false } 
    });
  },

  findById(id: number) {
    return prisma.notificacao.findUnique({ where: { id } });
  },

  marcarLida(id: number) {
    return prisma.notificacao.update({
      where: { id },
      data: { lida: true }
    });
  },

  marcarTodasLidas(candidatoId: number) {
    return prisma.notificacao.updateMany({
      where: { candidatoId, lida: false },
      data: { lida: true }
    });
  },

  async getConfiguracoes(candidatoId: number) {
    let config = await prisma.candidatoConfig.findUnique({
      where: { candidatoId }
    });
    
    if (!config) {
      config = await prisma.candidatoConfig.create({
        data: { candidatoId }
      });
    }
    
    return config;
  },

  updateConfiguracoes(candidatoId: number, data: any) {
    return prisma.candidatoConfig.upsert({
      where: { candidatoId },
      update: data,
      create: { candidatoId, ...data }
    });
  },

  criarNotificacao(data: {
    candidatoId: number;
    vagaId?: number;
    tipo: string;
    titulo: string;
    mensagem: string;
  }) {
    return prisma.notificacao.create({ data });
  },

  getCandidato(candidatoId: number) {
    return prisma.candidato.findUnique({
      where: { id: candidatoId },
      select: { id: true, nome: true, email: true }
    });
  },
};