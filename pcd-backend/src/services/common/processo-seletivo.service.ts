import { ProcessoSeletivoRepo } from "../../repositories/common/processo-seletivo.repo";

export const ProcessoSeletivoService = {
  async obterPipeline(vagaId: number) {
    const etapas = await ProcessoSeletivoRepo.getEtapasVaga(vagaId);
    const candidatosPorEtapa = await ProcessoSeletivoRepo.getCandidatosPorEtapa(vagaId);
    
    return {
      etapas,
      candidatosPorEtapa
    };
  },

  async moverCandidato(vagaId: number, candidatoId: number, novaEtapa: string, usuarioId?: number) {
    const candidatura = await ProcessoSeletivoRepo.findCandidatura(vagaId, candidatoId);
    if (!candidatura) throw new Error("Candidatura não encontrada");
    
    const etapaAnterior = candidatura.status;
    
    return ProcessoSeletivoRepo.updateEtapa(
      vagaId, 
      candidatoId, 
      novaEtapa, 
      etapaAnterior, 
      usuarioId
    );
  },

  async avaliarCandidato(vagaId: number, candidatoId: number, avaliacao: number, observacoes?: string, usuarioId?: number) {
    if (avaliacao < 1 || avaliacao > 5) {
      throw new Error("Avaliação deve ser entre 1 e 5");
    }
    
    return ProcessoSeletivoRepo.updateAvaliacao(
      vagaId, 
      candidatoId, 
      avaliacao, 
      observacoes, 
      usuarioId
    );
  },

  async obterCandidatosPorStatus(vagaId: number) {
    return ProcessoSeletivoRepo.getCandidatosPorStatus(vagaId);
  },
};