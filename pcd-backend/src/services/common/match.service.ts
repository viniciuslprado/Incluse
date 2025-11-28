import { MatchRepo } from "../../repositories/common/match.repo";

function getMatchThreshold(): number {
  const v = process.env.MATCH_THRESHOLD ?? "0.5"; // 50% mínimo
  const n = Number.parseFloat(v);
  if (Number.isFinite(n) && n >= 0) return Math.min(1, Math.max(0, n));
  return 0.5;
}

export const MatchService = {
    // --- Compatibilidade: área, localidade, disponibilidade ---
    calculateAreaScore(candidato: any, vaga: any): number {
      const candidatoAreas = candidato.areasFormacao || [];
      const vagaArea = vaga.area;
      if (!vagaArea || !candidatoAreas.length) return 0;
      const hasMatch = candidatoAreas.some((area: any) =>
        area.area?.nome === vagaArea || area.nome === vagaArea
      );
      return hasMatch ? 20 : 0;
    },

    calculateLocalidadeScore(candidato: any, vaga: any): number {
      const disponibilidade = candidato.disponibilidadeGeografica;
      const candidatoCidade = candidato.cidade;
      const candidatoEstado = candidato.estado;
      const vagaCidade = vaga.cidade;
      const vagaEstado = vaga.estado;
      // Se aceita mudança, recebe 10 direto
      if ([
        'Em todo o Brasil', 'Disponível internacional', 'Em todo o estado', 'Na minha região (cidades próximas)'
      ].includes(disponibilidade)) return 10;
      if (candidatoCidade && vagaCidade && candidatoCidade === vagaCidade) return 10;
      if (candidatoEstado && vagaEstado && candidatoEstado === vagaEstado) return 7;
      if (vagaCidade && candidatoCidade) return 5;
      return 0;
    },

    calculateDisponibilidadeScore(candidato: any): number {
      let score = 0;
      const disponibilidade = candidato.disponibilidadeGeografica;
      if (["Em todo o Brasil", "Disponível internacional", "Em todo o estado", "Na minha região (cidades próximas)"].includes(disponibilidade)) {
        score += 2.5;
      }
      if (disponibilidade === "Disponível internacional" || disponibilidade === "Em todo o Brasil") {
        score += 2.5;
      } else if (disponibilidade === "Aceita viagens") {
        score += 2.5;
      }
      return Math.min(5, score);
    },
  // Lógica de MATCH: etapa eliminatória (acessibilidade + escolaridade) e preparação para compatibilidade
  async matchVagasForCandidato(candidatoId: number) {
    const { candidato, candidatoBarreiras } = await MatchRepo.getCandidatoProfile(candidatoId);
    if (!candidato) throw Object.assign(new Error("Candidato não encontrado"), { status: 404 });
    if (!candidato.isActive) throw Object.assign(new Error("Conta desativada"), { status: 403 });

    const vagas = await MatchRepo.listVagasWithRelations();
    const results: any[] = [];

    for (const vaga of vagas) {
      // 1. Subtipo eliminatório
      const subtipoMatch = this.checkSubtipoMatch(candidato, vaga);
      if (!subtipoMatch) continue;

      // 2. Acessibilidade (eliminatório, 35%)
      const acessibilidadeMatch = await this.checkAcessibilidadeMatch(candidatoBarreiras, vaga);
      if (!acessibilidadeMatch.isCompatible) continue;

      // 3. Escolaridade mínima (eliminatório, 30%)
      const escolaridadeMatch = this.checkEscolaridadeMatch(
        candidato.escolaridade ?? undefined,
        vaga.escolaridade ?? undefined
      );
      if (!escolaridadeMatch) continue;

      // 4. Compatibilidade (área, localidade, disponibilidade)
      const areaScore = this.calculateAreaScore(candidato, vaga);
      const localidadeScore = this.calculateLocalidadeScore(candidato, vaga);
      const disponibilidadeScore = this.calculateDisponibilidadeScore(candidato);

      // Score final
      const matchScore = 35 + 30;
      const compatibilityScore = areaScore + localidadeScore + disponibilidadeScore;
      const totalScore = matchScore + compatibilityScore;

      results.push({
        id: vaga.id,
        titulo: vaga.titulo || undefined,
        empresa: vaga.empresa,
        cidade: vaga.cidade,
        estado: vaga.estado,
        tipoContratacao: vaga.tipoContratacao,
        modeloTrabalho: vaga.modeloTrabalho,
        localizacao: vaga.localizacao,
        area: vaga.area,
        escolaridade: vaga.escolaridade,
        status: vaga.status,
        matchPercent: totalScore,
        compatibility: compatibilityScore,
        totalScore,
        breakdown: {
          acessibilidade: 35,
          escolaridade: 30,
          area: areaScore,
          localidade: localidadeScore,
          disponibilidade: disponibilidadeScore
        },
        acessibilidadeMatch,
      });
    }
    return results;
  },

  // Método para buscar vagas com threshold customizado
  async matchVagasWithThreshold(candidatoId: number, threshold: number = 0.5) {
    const originalThreshold = process.env.MATCH_THRESHOLD;
    process.env.MATCH_THRESHOLD = threshold.toString();
    
    try {
      return await this.matchVagasForCandidato(candidatoId);
    } finally {
      if (originalThreshold) {
        process.env.MATCH_THRESHOLD = originalThreshold;
      } else {
        delete process.env.MATCH_THRESHOLD;
      }
    }
  },

  checkSubtipoMatch(candidato: any, vaga: any): boolean {
    return (candidato.subtipos ?? []).some((csub: any) => {
      const subtipoId = csub.subtipoId ?? csub.subtipo?.id;
      return (vaga.subtiposAceitos ?? []).some((vs: any) => {
        const sId = vs.subtipoId ?? vs.subtipo?.id ?? vs.id;
        return sId === subtipoId;
      });
    });
  },

  checkEscolaridadeMatch(candidatoEscolaridade?: string, vagaEscolaridade?: string): boolean {
    if (!vagaEscolaridade || !candidatoEscolaridade) return true;
    
    const niveis = {
      "Ensino Fundamental Incompleto": 1,
      "Ensino Fundamental Completo": 2,
      "Ensino Médio Incompleto": 3,
      "Ensino Médio Completo": 4,
      "Técnico": 4.5,
      "Ensino Superior Incompleto": 5,
      "Ensino Superior Completo": 6,
      "Pós-graduação": 7,
      "Mestrado": 8,
      "Doutorado": 9
    };
    
    const nivelCandidato = niveis[candidatoEscolaridade as keyof typeof niveis] || 0;
    const nivelVaga = niveis[vagaEscolaridade as keyof typeof niveis] || 0;
    
    return nivelCandidato >= nivelVaga;
  },

  async checkAcessibilidadeMatch(candidatoBarreiras: any[], vaga: any) {
    if (!candidatoBarreiras.length) {
      return { isCompatible: true, coverage: 100, details: 'Nenhuma barreira cadastrada' };
    }

    const vagaAcessIds = new Set<number>(
      (vaga.acessibilidades ?? []).map((a: any) => a.acessibilidadeId ?? a.acessibilidade?.id).filter(Boolean)
    );

    const allBarrierIds = Array.from(new Set(candidatoBarreiras.map(b => b.barreiraId)));
    const mappings = await MatchRepo.listBarreiraAcessibilidadesForBarreiras(allBarrierIds);
    
    const barreiraToAcess = new Map<number, Set<number>>();
    for (const m of mappings) {
      const s = barreiraToAcess.get(m.barreiraId) ?? new Set<number>();
      s.add(m.acessibilidadeId);
      barreiraToAcess.set(m.barreiraId, s);
    }

    let coveredCount = 0;
    for (const barreiraId of allBarrierIds) {
      const acessibilidadesParaBarreira = barreiraToAcess.get(barreiraId) ?? new Set();
      const coberta = Array.from(acessibilidadesParaBarreira).some(aid => vagaAcessIds.has(aid));
      if (coberta) coveredCount++;
    }

    const coverage = (coveredCount / allBarrierIds.length) * 100;
    return {
      isCompatible: coverage === 100, // MATCH exige 100%
      coverage,
      totalBarreiras: allBarrierIds.length,
      cobertas: coveredCount
    };
  },
};
