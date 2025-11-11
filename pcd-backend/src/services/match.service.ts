import { MatchRepo } from "../repositories/match.repo";

export const MatchService = {
  // strict criteria: all candidate barriers for a subtipo must be resolved by at least one acessibilidade offered by the vaga
  async matchVagasForCandidato(candidatoId: number) {
    const { candidato, candidatoBarreiras } = await MatchRepo.getCandidatoProfile(candidatoId);
    if (!candidato) throw Object.assign(new Error("Candidato não encontrado"), { status: 404 });

    const vagas = await MatchRepo.listVagasWithRelations();

    // build a map of candidate barriers grouped by subtipoId
    const barreirasPorSubtipo = new Map<number, Array<{ barreiraId: number; descricao?: string }>>();
    for (const cb of candidatoBarreiras) {
      const arr = barreirasPorSubtipo.get(cb.subtipoId) ?? [];
      arr.push({ barreiraId: cb.barreiraId, descricao: cb.barreira?.descricao });
      barreirasPorSubtipo.set(cb.subtipoId, arr);
    }

    // collect all distinct barrier ids we need to check
    const allBarrierIds = Array.from(new Set(candidatoBarreiras.map((b) => b.barreiraId)));

    // fetch barrier->acessibilidade mappings for the barriers the candidate faces
    const mappings = await MatchRepo.listBarreiraAcessibilidadesForBarreiras(allBarrierIds);
    // build map: barreiraId -> Set(acessibilidadeId)
    const barreiraToAcess = new Map<number, Set<number>>();
    for (const m of mappings) {
      const s = barreiraToAcess.get(m.barreiraId) ?? new Set<number>();
      s.add(m.acessibilidadeId);
      barreiraToAcess.set(m.barreiraId, s);
    }

    const matches: any[] = [];

    // for each vaga, check candidate subtipos
    for (const vaga of vagas) {
      // build set of acessibilidade ids offered by vaga
      const vagaAcessIds = new Set<number>(vaga.acessibilidades.map((a: any) => a.acessibilidadeId ?? a.acessibilidade?.id));

      let vagaMatches: any[] = [];

      for (const csub of candidato.subtipos ?? []) {
    const subtipoId = csub.subtipoId ?? csub.subtipo?.id;

        // is this subtipo accepted by the vaga?
        const aceita = (vaga.subtiposAceitos ?? []).some((vs: any) => {
          const sId = vs.subtipoId ?? vs.subtipo?.id ?? vs.id;
          return sId === subtipoId;
        });
        if (!aceita) continue;

        // barriers candidate faces for this subtipo
        const bList = barreirasPorSubtipo.get(subtipoId) ?? [];
        if (!bList.length) continue; // candidate does not report barriers for this subtipo

        const matchedBarreiras: any[] = [];
        const missingBarreiras: any[] = [];

        for (const b of bList) {
          // which acessibilities resolve this barrier?
          const aSet = barreiraToAcess.get(b.barreiraId) ?? new Set<number>();

          // check intersection between aSet and vagaAcessIds
          const resolved = Array.from(aSet).some((aid) => vagaAcessIds.has(aid));
          if (resolved) matchedBarreiras.push(b);
          else missingBarreiras.push(b);
        }

        const allResolved = matchedBarreiras.length > 0 && missingBarreiras.length === 0;

        vagaMatches.push({
          subtipoId,
          subtipoName: csub.subtipo?.nome ?? null,
          matchedBarreiras,
          missingBarreiras,
          allResolved,
        });
      }

      // if at least one subtipo for this vaga is fully resolved, consider vaga compatible
      const hasFull = vagaMatches.some((vm) => vm.allResolved);
      if (hasFull) {
        matches.push({
          vagaId: vaga.id,
          vagaTitulo: vaga.titulo,
          matches: vagaMatches.filter((vm) => vm.allResolved),
        });
      }
    }

    return matches;
  },
};
