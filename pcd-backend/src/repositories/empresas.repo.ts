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
  findByEmail(email: string | null | undefined) {
    if (!email) return null;
    return prisma.empresa.findUnique({ where: { email } });
  },
  create(nome: string, cnpj?: string, email?: string, senhaHash?: string) {
    // prisma client may be out-of-date locally; cast data to any to avoid type errors until client is regenerated
    const data: any = { nome, cnpj, email };
    if (senhaHash) data.senhaHash = senhaHash;
    return (prisma as any).empresa.create({ data });
  },
};
