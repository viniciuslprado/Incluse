import { prisma } from "../../prismaClient";

export const EmpresasRepo = {
  list() {
    return prisma.empresa.findMany({
      orderBy: { id: "asc" },
      select: { 
        id: true,
        nome: true,
        cnpj: true,
        email: true,
        createdAt: true
      },
    });
  },

  findById(id: number) {
    return prisma.empresa.findUnique({
      where: { id },
      include: {
        vagas: {
          orderBy: { createdAt: "desc" },
          select: { 
            id: true, 
            titulo: true, 
            status: true,
            tipoContratacao: true,
            modeloTrabalho: true,
            area: true,
            createdAt: true 
          },
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
    const data: any = { nome, cnpj, email };
    if (senhaHash) data.senhaHash = senhaHash;
    return (prisma as any).empresa.create({ data });
  },

  update(id: number, data: any) {
    const allowedFields = [
      'nome', 'cnpj', 'email', 'telefone', 'endereco', 
      'areaAtuacao', 'descricao', 'logoUrl'
    ];
    const updateData: any = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }
    return (prisma as any).empresa.update({
      where: { id },
      data: updateData
    });
  },

  updateLogo(id: number, logoUrl: string) {
    return (prisma as any).empresa.update({
      where: { id },
      data: { logoUrl }
    });
  },

  async getConfiguracoes(empresaId: number) {
    throw new Error('empresaConfig não existe no schema do Prisma');
  },

  updateConfiguracoes(empresaId: number, data: any) {
    throw new Error('empresaConfig não existe no schema do Prisma');
  },
};
