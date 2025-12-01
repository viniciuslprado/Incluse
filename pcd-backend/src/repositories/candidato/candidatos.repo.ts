import prisma from "../../prismaClient";

export const CandidatosRepo = {
  // Lista as barreiras vinculadas a um subtipo para um candidato
  listarBarreirasVinculadas(candidatoId: number, subtipoId: number) {
    return prisma.candidatoSubtipoBarreira.findMany({
      where: { candidatoId, subtipoId },
      include: { barreira: true },
    }).then(arr => arr.map(item => item.barreira));
  },
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
        areasFormacao: true,
        experiencias: true,
        formacoes: true,
        cursos: true,
        competencias: true,
        idiomas: true,
        configuracoes: true,
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
    // Busca os subtipos do candidato
    const candidatoSubtipos = await prisma.candidatoSubtipo.findMany({ where: { candidatoId } });

    // Subtipos aceitos pela vaga
    const vagaSubtipos = await prisma.vagaSubtipo.findMany({ where: { vagaId }, select: { subtipoId: true } });
    const vagaSubtiposSet = new Set(vagaSubtipos.map(vs => vs.subtipoId));
    // Acessibilidades configuradas para a vaga
    const vagaAcess = await prisma.vagaAcessibilidade.findMany({ where: { vagaId }, select: { acessibilidadeId: true } });
    const vagaAcessSet = new Set(vagaAcess.map(a => a.acessibilidadeId));

    // Busca as barreiras do candidato (para todos os subtipos)
    const candidatoBarreiras = await prisma.candidatoSubtipoBarreira.findMany({ where: { candidatoId }, select: { subtipoId: true, barreiraId: true } });

    // Se a vaga exige subtipos e o candidato não tem nenhum (nem por barreira), não faz match
    if (vagaSubtipos.length > 0 && candidatoSubtipos.length === 0 && candidatoBarreiras.length === 0) return false;

    // Busca mapping barreira -> acessibilidade
    const barreiraIds = Array.from(new Set(candidatoBarreiras.map(b => b.barreiraId))).filter(Boolean);
    const barreiraAcess = barreiraIds.length ? await prisma.barreiraAcessibilidade.findMany({ where: { barreiraId: { in: barreiraIds } }, select: { barreiraId: true, acessibilidadeId: true } }) : [];
    const barreiraToAcessMap = new Map<number, number[]>();
    for (const ba of barreiraAcess) {
      const arr = barreiraToAcessMap.get(ba.barreiraId) || [];
      arr.push(ba.acessibilidadeId);
      barreiraToAcessMap.set(ba.barreiraId, arr);
    }

    // Caso o candidato não tenha registros em CandidatoSubtipo, mas tenha
    // barreiras registradas (CandidatoSubtipoBarreira), derive os subtipos
    // a partir dos próprios registros de barreira.
    const candidatoSubtiposEffective = candidatoSubtipos.length > 0
      ? candidatoSubtipos
      : Array.from(new Set(candidatoBarreiras.map(b => b.subtipoId))).map(id => ({ subtipoId: id } as any));

    // DEBUG
    console.log('[checkVagaMatch] vagaSubtipos:', vagaSubtipos.map(v => v.subtipoId));
    console.log('[checkVagaMatch] vagaAcessIds:', vagaAcess.map(v => v.acessibilidadeId));
    console.log('[checkVagaMatch] candidatoSubtiposEffective:', candidatoSubtiposEffective.map(c => c.subtipoId));
    console.log('[checkVagaMatch] candidatoBarreiras:', candidatoBarreiras);

    // Para cada subtipo do candidato que também é aceito pela vaga (ou para
    // qualquer subtipo caso a vaga aceite todos), verifica se existe ao menos
    // uma barreira informada cujo(s) acessibilidade(s) esteja(m) presente(s)
    // nas acessibilidades da vaga. Se o candidato não informou barreiras,
    // considera-se compatível (não há necessidades de acessibilidade).
    for (const cs of candidatoSubtiposEffective) {
      if (vagaSubtipos.length > 0 && !vagaSubtiposSet.has(cs.subtipoId)) continue;

      // todas as barreiras do candidato para este subtipo
      const barrasDoSubtipo = candidatoBarreiras.filter(b => b.subtipoId === cs.subtipoId).map(b => b.barreiraId);
      // Se o candidato não tem barreiras registradas para este subtipo,
      // consideramos que não há necessidade de acessibilidade — então
      // essa combinação (subtipo + vaga) é compatível.
      if (!barrasDoSubtipo.length) return true;

      for (const barreiraId of barrasDoSubtipo) {
        const acessForBarreira = barreiraToAcessMap.get(barreiraId) || [];
        for (const aId of acessForBarreira) {
          if (vagaAcessSet.has(aId)) {
            return true; // encontrou compatibilidade (subtipo aceito e acessibilidade disponível)
          }
        }
      }
    }

    return false;
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
