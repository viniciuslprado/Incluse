import { prisma } from "./prisma";
export const EmpresasRepo = {
  list() {
    return prisma.empresa.findMany({
      orderBy: { id: "asc" },
      select: { id: true, nome: true, cnpj: true, email: true },
    });
  },
  findById(id: number) {
    return prisma.empresa.findUnique({
      where: { id },
      include: {
        vagas: {
          orderBy: { id: "asc" },
          select: { id: true, descricao: true, escolaridade: true },
        },
      },
    });
  },
  findByCnpj(cnpj: string) {
    return prisma.empresa.findUnique({ where: { cnpj } });
  },
  create(nome: string, cnpj?: string, email?: string) {
    return prisma.empresa.create({ data: { nome, cnpj, email } });
  },
};
