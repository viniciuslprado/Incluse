
import prisma from "../../prismaClient";

export const CandidatosRepo = {
  listarAreasFormacao(id: number) {
    return prisma.candidato.findUnique({
      where: { id },
      select: { areasFormacao: true }
    }).then(c => c?.areasFormacao || []);
  },
  findById(id: number) {
    return prisma.candidato.findUnique({
      where: { id },
      include: {
        subtipos: { include: { subtipo: true } },
        barras: { include: { barreira: true, subtipo: true } },
      },
    });
  },

  create(data: { nome: string; cpf?: string; email?: string; telefone?: string; escolaridade?: string; curso?: string; situacao?: string; senhaHash?: string; curriculo?: string; laudo?: string }) {
    return (prisma as any).candidato.create({ data });
  },

  update(id: number, data: any) {
    return (prisma as any).candidato.update({
      where: { id },
      data
    });
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

  async replaceSubtipos(candidatoId: number, subtipoIds: number[]) {
    await prisma.candidatoSubtipo.deleteMany({ where: { candidatoId } });
    if (!subtipoIds.length) return { ok: true };
    await prisma.candidatoSubtipo.createMany({
      data: subtipoIds.map((subtipoId) => ({ candidatoId, subtipoId })),
      skipDuplicates: true,
    });
    return { ok: true };
  },

  vincularBarreiras(candidatoId: number, subtipoId: number, barreiraIds: number[]) {
    return prisma.candidatoSubtipoBarreira.createMany({
      data: barreiraIds.map((barreiraId) => ({ candidatoId, subtipoId, barreiraId })),
      skipDuplicates: true,
    });
  },

  async replaceBarreiras(candidatoId: number, subtipoId: number, barreiraIds: number[]) {
    await prisma.candidatoSubtipoBarreira.deleteMany({ where: { candidatoId, subtipoId } });
    if (!barreiraIds.length) return { ok: true };
    await prisma.candidatoSubtipoBarreira.createMany({
      data: barreiraIds.map((barreiraId) => ({ candidatoId, subtipoId, barreiraId })),
      skipDuplicates: true,
    });
    return { ok: true };
  },

  updateCurriculo(candidatoId: number, curriculoUrl: string) {
    return prisma.candidato.update({
      where: { id: candidatoId },
      data: { curriculo: curriculoUrl }
    });
  },

  findVagaById(vagaId: number) {
    return prisma.vaga.findUnique({
      where: { id: vagaId },
      select: { id: true, status: true, empresaId: true }
    });
  },

  async checkVagaMatch(candidatoId: number, vagaId: number) {
    const candidatoSubtipos = await prisma.candidatoSubtipo.findMany({
      where: { candidatoId }
    });
    
    if (!candidatoSubtipos.length) return false;
    
    const vagaSubtipos = await prisma.vagaSubtipo.findMany({
      where: { vagaId }
    });
    
    const hasSubtipoMatch = candidatoSubtipos.some((cs: any) =>
      vagaSubtipos.some((vs: any) => vs.subtipoId === cs.subtipoId)
    );
    
    return hasSubtipoMatch;
  },

  createFavorito(candidatoId: number, vagaId: number) {
    return prisma.candidatoVagaFavorita.create({
      data: { candidatoId, vagaId }
    });
  },

  deleteFavorito(candidatoId: number, vagaId: number) {
    return prisma.candidatoVagaFavorita.delete({
      where: { candidatoId_vagaId: { candidatoId, vagaId } }
    });
  },

  getFavoritos(candidatoId: number) {
    return prisma.candidatoVagaFavorita.findMany({
      where: { candidatoId },
      include: {
        vaga: {
          select: {
            id: true,
            titulo: true,
            status: true,
            area: true,
            modeloTrabalho: true,
            localizacao: true,
            createdAt: true,
            empresa: {
              select: { nome: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async delete(id: number) {
    // Deletar relacionamentos antes de deletar o candidato
    await prisma.candidatoSubtipo.deleteMany({ where: { candidatoId: id } });
    // await prisma.candidatoBarreira.deleteMany({ where: { candidatoId: id } });
    await prisma.candidatoVagaFavorita.deleteMany({ where: { candidatoId: id } });
    await prisma.candidatura.deleteMany({ where: { candidatoId: id } });
    await prisma.refreshToken.deleteMany({ where: { userId: id, userType: 'candidato' } });
    // await prisma.passwordReset.deleteMany({ where: { userId: id, userType: 'candidato' } });
    
    return prisma.candidato.delete({ where: { id } });
  },
};
