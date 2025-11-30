import prisma from '../../prismaClient';

export const TiposRepo = {
  // Lista todas as barreiras associadas a subtipos de um tipo
  async listBarreirasPorTipo(tipoId: number) {
    // Busca todos os subtipos do tipo
    const subtipos = await prisma.subtipoDeficiencia.findMany({
      where: { tipoId },
      select: { id: true },
    });
    const subtipoIds = subtipos.map(s => s.id);
    if (!subtipoIds.length) return [];
    // Busca todas as barreiras vinculadas a esses subtipos
    const subtipoBarreiras = await prisma.subtipoBarreira.findMany({
      where: { subtipoId: { in: subtipoIds } },
      include: { barreira: true },
    });
    // Retorna barreiras únicas
    const barreirasMap = new Map();
    for (const sb of subtipoBarreiras) {
      if (sb.barreira) barreirasMap.set(sb.barreira.id, sb.barreira);
    }
    return Array.from(barreirasMap.values()).sort((a, b) => a.descricao.localeCompare(b.descricao));
  },
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