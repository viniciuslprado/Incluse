import { prisma } from "./prisma";

export const CandidatosRepo = {
  findById(id: number) {
    return prisma.candidato.findUnique({
      where: { id },
      include: {
        subtipos: { include: { subtipo: true } },
        barras: { include: { barreira: true, subtipo: true } },
      },
    });
  },

  create(data: { nome: string; cpf?: string; email?: string; telefone?: string; escolaridade?: string; senhaHash?: string }) {
    // Ensure Prisma create call matches generated client; cast to any while client is out-of-date
    return (prisma as any).candidato.create({ data });
  },

  findByEmail(email: string | null | undefined) {
    if (!email) return null;
    return (prisma as any).candidato.findUnique({ where: { email } });
  },

  findByCpf(cpf: string | null | undefined) {
    if (!cpf) return null;
    return (prisma as any).candidato.findUnique({ where: { cpf } });
  },

  listSubtipos(candidatoId: number) {
    return prisma.candidatoSubtipo.findMany({ where: { candidatoId }, include: { subtipo: true } });
  },

  vincularSubtipos(candidatoId: number, subtipoIds: number[]) {
    return prisma.candidatoSubtipo.createMany({
      data: subtipoIds.map((subtipoId) => ({ candidatoId, subtipoId })),
      skipDuplicates: true,
    });
  },

  vincularBarreiras(candidatoId: number, subtipoId: number, barreiraIds: number[]) {
    return prisma.candidatoSubtipoBarreira.createMany({
      data: barreiraIds.map((barreiraId) => ({ candidatoId, subtipoId, barreiraId })),
      skipDuplicates: true,
    });
  },
};
