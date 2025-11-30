import { prisma } from "../../prismaClient";
//exportando um obj TiposRepo que contem as funções
//list, listWithSubtipos, create e findById
//que serão usadas no service
export const SubtiposRepo = {
  list() {
    return prisma.subtipoDeficiencia.findMany({ orderBy: { nome: "asc" } });
  },
  findById(id: number) {
    return prisma.subtipoDeficiencia.findUnique({ 
      where: { id } });
  },
   // usado pelo GET /subtipos/:id (com joins + ordenações)
  findDeepById(id: number) {
    return prisma.subtipoDeficiencia.findUnique({
      where: { id },
      include: {
        tipo: true,
        barreiras: {
          include: {
            barreira: {
              include: {
                acessibilidades: {
                  include: { acessibilidade: true },
                  orderBy: { acessibilidadeId: "asc" },
                },
              },
            },
          },
          orderBy: { barreiraId: "asc" },
        },
      },
    });
  },

  create(nome: string, tipoId: number) {
    return prisma.subtipoDeficiencia.create({ data: { nome, tipoId } });
  },
  update(id: number, nome: string) {
    return prisma.subtipoDeficiencia.update({ where: { id }, data: { nome } });
  },
  delete(id: number) {
    return prisma.subtipoDeficiencia.delete({ where: { id } });
  },
};