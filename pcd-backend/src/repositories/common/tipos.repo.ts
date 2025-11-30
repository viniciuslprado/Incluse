import prisma from '../../prismaClient';

export const TiposRepo = {
  list() {
    return prisma.tipoDeficiencia.findMany({ orderBy: { nome: "asc" } });
  },
  listWithSubtipos() {
    return prisma.tipoDeficiencia.findMany({
      orderBy: { nome: "asc" },
      include: { subtipos: { orderBy: { nome: "asc" } } },
    });
  },
  listSubtipos(tipoId: number) {
    return prisma.subtipoDeficiencia.findMany({ where: { tipoId }, orderBy: { nome: "asc" } });
  },
  create(nome: string) {
    return prisma.tipoDeficiencia.create({ data: { nome } });
  },
  findById(id: number) {
    return prisma.tipoDeficiencia.findUnique({ where: { id } });
  },
  update(id: number, nome: string) {
    return prisma.tipoDeficiencia.update({ where: { id }, data: { nome } });
  },
};