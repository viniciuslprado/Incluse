// src/services/match.service.ts
import { MatchRepo } from "../repositories/match.repo";

export async function encontrarVagasCompativeis(candidatoId: number): Promise<any[]> {
  const candidato = await MatchRepo.getCandidatoComBarreiras(candidatoId);
  if (!candidato) throw new Error("Candidato não encontrado");

  const vagas = await MatchRepo.getVagasComDetalhes();
  const mapaBA = await MatchRepo.getMapaBarreiraAcessibilidade();
  // Constrói mapa de subtipoId -> barreiras do candidato
  const mapaSubtipoBarreiras: Record<number, { barreiraId: number }[]> = {};
  (candidato.barras || []).forEach((b: any) => {
    const key = Number(b.subtipoId);
    if (!mapaSubtipoBarreiras[key]) mapaSubtipoBarreiras[key] = [];
    mapaSubtipoBarreiras[key].push({ barreiraId: Number(b.barreiraId) });
  });

  const candidatoSubtipos = (candidato.subtipos || []).map((s: any) => ({
    subtipoId: Number(s.subtipoId),
    barreiras: mapaSubtipoBarreiras[Number(s.subtipoId)] || [],
  }));

  return vagas.filter((vaga) =>
    candidatoSubtipos.every((cs) => {
      // 1️⃣ a vaga aceita o subtipo?
      const aceita = vaga.subtiposAceitos.some((vs) => vs.subtipoId === cs.subtipoId);
      if (!aceita) return false;

      // 2️⃣ para cada barreira do subtipo, há uma acessibilidade compatível na vaga?
      return cs.barreiras.every((cb) => {
        const acessCompativeis = mapaBA
          .filter((m) => m.barreiraId === cb.barreiraId)
          .map((m) => m.acessibilidadeId);

        const oferecidas = (vaga.acessibilidades || []).map((a) => a.acessibilidadeId);

        return acessCompativeis.some((aid) => oferecidas.includes(aid));
      });
    })
  );
}
