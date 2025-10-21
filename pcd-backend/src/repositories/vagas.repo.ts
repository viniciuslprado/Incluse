import { prisma } from "./prisma";

export const VagasRepo = {
 list(empresaId?: number) {
  return prisma.vaga.findMany({
    where: empresaId ? { empresaId } : undefined,
    orderBy: { id: "asc" },
    include: {
      empresa: { select: { id: true, nome: true } },
    },
  });
},

  findById(id: number) {
    return prisma.vaga.findUnique({
      where: { id },
      include: {
        empresa: { select: { id: true, nome: true, cnpj: true } },
        subtiposAceitos: {
          include: { subtipo: { select: { id: true, nome: true, tipoId: true } } },
          orderBy: { subtipoId: "asc" },
        },
        acessibilidades: {
          include: { acessibilidade: { select: { id: true, descricao: true } } },
          orderBy: { acessibilidadeId: "asc" },
        },
      },
    });
  },

  create(empresaId: number, titulo: string, descricao: string, escolaridade: string, cidade?: string, estado?: string) {
    return prisma.vaga.create({ 
      data: { 
        empresaId, 
        titulo,
        descricao, 
        escolaridade,
        cidade,
        estado 
      } 
    });
  },

  linkSubtipos(vagaId: number, subtipoIds: number[]) {
    const data = subtipoIds.map((subtipoId) => ({ vagaId, subtipoId }));
    return prisma.vagaSubtipo.createMany({ data, skipDuplicates: true });
  },

  linkAcessibilidades(vagaId: number, acessibilidadeIds: number[]) {
    const data = acessibilidadeIds.map((acessibilidadeId) => ({ vagaId, acessibilidadeId }));
    return prisma.vagaAcessibilidade.createMany({ data, skipDuplicates: true });
  },
};