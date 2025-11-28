import { AreasFormacaoRepo } from '../../repositories/common/areas-formacao.repo';

export const AreasFormacaoService = {
  async listarTodas() {
    return AreasFormacaoRepo.listarTodas();
  },

  async listarPorCandidato(candidatoId: number) {
    return AreasFormacaoRepo.listarPorCandidato(candidatoId);
  },

  async vincularAreasCandidato(candidatoId: number, areaIds: number[]) {
    return AreasFormacaoRepo.vincularAreasCandidato(candidatoId, areaIds);
  },
};
