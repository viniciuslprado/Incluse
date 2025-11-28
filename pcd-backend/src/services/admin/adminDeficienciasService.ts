import { prisma } from '../../prismaClient.js';

export const adminDeficienciasService = {
  async listar() {
    return prisma.tipoDeficiencia.findMany();
  },
  async criar(nome: string) {
    return prisma.tipoDeficiencia.create({ data: { nome } });
  },
  async atualizar(id: number, nome: string) {
    return prisma.tipoDeficiencia.update({ where: { id }, data: { nome } });
  },
  async deletar(id: number) {
    return prisma.tipoDeficiencia.delete({ where: { id } });
  },
  async listarSubtipos(deficienciaId: number) {
    return prisma.subtipoDeficiencia.findMany({ where: { tipoId: deficienciaId } });
  }
};
