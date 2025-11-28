import { prisma } from '../../prismaClient.js';

export const adminAcessibilidadesService = {
  async listar() {
    return prisma.acessibilidade.findMany();
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
