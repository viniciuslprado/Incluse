import { MatchRepo } from "../repositories/match.repo";

const MATCH_THRESHOLD = (() => {
  const v = process.env.MATCH_THRESHOLD ?? "1.0";
  const n = Number.parseFloat(v);
  if (Number.isFinite(n) && n >= 0) return Math.min(1, Math.max(0, n));
  return 1.0;
})();

export const MatchService = {
  // returns an array of vagas with compatibility percentage and breakdown per subtipo
  async matchVagasForCandidato(candidatoId: number) {
    const { candidato, candidatoBarreiras } = await MatchRepo.getCandidatoProfile(candidatoId);
    if (!candidato) throw Object.assign(new Error("Candidato não encontrado"), { status: 404 });

    const vagas = await MatchRepo.listVagasWithRelations();

    // group candidate barriers by subtipoId
    const barreirasPorSubtipo = new Map<number, Array<{ barreiraId: number; descricao?: string }>>();
    for (const cb of candidatoBarreiras) {
      const arr = barreirasPorSubtipo.get(cb.subtipoId) ?? [];
      arr.push({ barreiraId: cb.barreiraId, descricao: cb.barreira?.descricao });
      barreirasPorSubtipo.set(cb.subtipoId, arr);
    }

    const allBarrierIds = Array.from(new Set(candidatoBarreiras.map((b) => b.barreiraId)));

    const mappings = await MatchRepo.listBarreiraAcessibilidadesForBarreiras(allBarrierIds);
    const barreiraToAcess = new Map<number, Set<number>>();
    for (const m of mappings) {
      const s = barreiraToAcess.get(m.barreiraId) ?? new Set<number>();
      s.add(m.acessibilidadeId);
      barreiraToAcess.set(m.barreiraId, s);
    }

    const results: any[] = [];

    for (const vaga of vagas) {
      const vagaAcessIds = new Set<number>(
        (vaga.acessibilidades ?? []).map((a: any) => a.acessibilidadeId ?? a.acessibilidade?.id).filter(Boolean)
      );

      const subtipoBreakdowns: any[] = [];

      for (const csub of candidato.subtipos ?? []) {
        const subtipoId = csub.subtipoId ?? csub.subtipo?.id;
        if (!subtipoId) continue;

        // check if vaga accepts this subtipo
        const aceita = (vaga.subtiposAceitos ?? []).some((vs: any) => {
          const sId = vs.subtipoId ?? vs.subtipo?.id ?? vs.id;
          return sId === subtipoId;
        });
        if (!aceita) continue;

        const bList = barreirasPorSubtipo.get(subtipoId) ?? [];
        if (!bList.length) continue;

        const covered: any[] = [];
        const uncovered: any[] = [];

        for (const b of bList) {
          const aSet = barreiraToAcess.get(b.barreiraId) ?? new Set<number>();
          const resolved = Array.from(aSet).some((aid) => vagaAcessIds.has(aid));
          if (resolved) covered.push(b);
          else uncovered.push(b);
        }

        const percent = bList.length ? covered.length / bList.length : 0;

        subtipoBreakdowns.push({
          subtipoId,
          subtipoName: csub.subtipo?.nome ?? null,
          totalBarreiras: bList.length,
          coveredBarreiras: covered,
          uncoveredBarreiras: uncovered,
          percent,
        });
      }

      if (!subtipoBreakdowns.length) continue;

      // the vaga compatibility is the maximum percent among subtipos (candidate can match by at least one subtipo)
      const vagaPercent = Math.max(...subtipoBreakdowns.map((s) => s.percent));

      if (vagaPercent >= MATCH_THRESHOLD) {
        results.push({
          vagaId: vaga.id,
          vagaTitulo: vaga.titulo,
          compatibility: vagaPercent,
          subtipoBreakdowns,
        });
      }
    }

    return results;
  },
};
