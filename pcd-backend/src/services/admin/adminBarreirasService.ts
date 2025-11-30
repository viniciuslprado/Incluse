import { prisma } from '../../prismaClient.js';

export const adminBarreirasService = {
  async listar() {
    return prisma.barreira.findMany();
  },

  async listarPorSubtipo(subtipoId: number) {
    // Busca todas as barreiras vinculadas ao subtipo
    const vinculos = await prisma.subtipoBarreira.findMany({
      where: { subtipoId },
      include: { barreira: true }
    });
    return vinculos.map(v => v.barreira);
  },
  async criar(descricao: string) {
    return prisma.barreira.create({ data: { descricao } });
  },
  async atualizar(id: number, descricao: string) {
    return prisma.barreira.update({ where: { id }, data: { descricao } });
  },
  async deletar(id: number) {
    return prisma.barreira.delete({ where: { id } });
  }
};
