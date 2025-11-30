import { prisma } from '../../prismaClient.js';

export const adminAcessibilidadesService = {
  async listar() {
    return prisma.acessibilidade.findMany();
  },

  async listarPorBarreira(barreiraId: number) {
    // Busca todas as acessibilidades vinculadas à barreira
    const vinculos = await prisma.barreiraAcessibilidade.findMany({
      where: { barreiraId },
      include: { acessibilidade: true }
    });
    return vinculos.map(v => v.acessibilidade);
  },
  async criar(descricao: string) {
    return prisma.acessibilidade.create({ data: { descricao } });
  },
  async atualizar(id: number, descricao: string) {
    return prisma.acessibilidade.update({ where: { id }, data: { descricao } });
  },
  async deletar(id: number) {
    return prisma.acessibilidade.delete({ where: { id } });
  }
};
