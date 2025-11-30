import prisma from '../../prismaClient';
export const AcessRepo = {
  list() {
    return prisma.acessibilidade.findMany({ orderBy: { descricao: "asc" } });
  },
  create(descricao: string) {
    return prisma.acessibilidade.create({ data: { descricao } });
  },
  findById(id: number) {
    return prisma.acessibilidade.findUnique({ where: { id } });
  },
  delete(id: number) {
    return prisma.acessibilidade.delete({ where: { id } });
  },
  update(id: number, descricao: string) {
    return prisma.acessibilidade.update({ where: { id }, data: { descricao } });
  },
};
