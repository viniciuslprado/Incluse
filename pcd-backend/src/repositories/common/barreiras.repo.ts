import prisma from '../../prismaClient';

export const BarreirasRepo = {
  list() {
    return prisma.barreira.findMany({ orderBy: { descricao: "asc" } });
  },
  create(descricao: string) {
    return prisma.barreira.create({ data: { descricao } });
  },
  update(id: number, descricao: string) {
    return prisma.barreira.update({ where: { id }, data: { descricao } });
  },
  delete(id: number) {
    return prisma.barreira.delete({ where: { id } });
  },
  findById(id: number) {
    return prisma.barreira.findUnique({ where: { id } });
  },
  // opcional: listar acessibilidades já diretamente pela barreira
  listAcessibilidades(id: number) {
    return prisma.barreira.findUnique({
      where: { id },
      include: {
        acessibilidades: {
          include: { acessibilidade: true },
          orderBy: { acessibilidadeId: "asc" },
        },
      },
    });
  },
};
