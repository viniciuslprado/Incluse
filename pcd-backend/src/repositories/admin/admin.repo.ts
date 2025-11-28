import { prisma } from "../../prismaClient";

export const AdminRepo = {
  getEmpresas(where: any, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return prisma.empresa.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nome: true,
        email: true,
        cnpj: true,
        isActive: true,
        createdAt: true,
        _count: { select: { vagas: true } }
      }
    });
  },

  countEmpresas(where: any) {
    return prisma.empresa.count({ where });
  },

  findEmpresaById(id: number) {
    return prisma.empresa.findUnique({ where: { id } });
  },

  updateEmpresaStatus(id: number, isActive: boolean) {
    return prisma.empresa.update({
      where: { id },
      data: { isActive }
    });
  },

  getCandidatos(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return prisma.candidato.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nome: true,
        email: true,
        escolaridade: true,
        createdAt: true,
        _count: { select: { candidaturas: true } }
      }
    });
  },

  countCandidatos() {
    return prisma.candidato.count();
  },

  getVagas(where: any, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return prisma.vaga.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        titulo: true,
        status: true,
        area: true,
        createdAt: true,
        empresa: { select: { nome: true } },
        _count: { select: { candidaturas: true } }
      }
    });
  },

  countVagas(where: any) {
    return prisma.vaga.count({ where });
  },

  findVagaById(id: number) {
    return prisma.vaga.findUnique({ where: { id } });
  },

  updateVagaStatus(id: number, status: string) {
    return prisma.vaga.update({
      where: { id },
      data: { status }
    });
  },

  countCandidaturas() {
    return prisma.candidatura.count();
  },

  getLogs(tipo?: string, page: number = 1, limit: number = 50) {
    // Placeholder - implementar quando tiver tabela de logs
    return [];
  },

  countLogs(tipo?: string) {
    // Placeholder - implementar quando tiver tabela de logs
    return 0;
  },
};