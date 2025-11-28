import { Request, Response } from "express";
import { ProcessoSeletivoService } from "../../services/common/processo-seletivo.service";

export const ProcessoSeletivoController = {
  // GET /vaga/:id/pipeline - Pipeline do processo seletivo
  async obterPipeline(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const pipeline = await ProcessoSeletivoService.obterPipeline(vagaId);
      res.json(pipeline);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao obter pipeline" });
    }
  },

  // POST /vaga/:id/candidato/:cid/mover - Mover candidato entre etapas
  async moverCandidato(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const candidatoId = Number(req.params.cid);
      const { novaEtapa } = req.body;
      const usuarioId = (req as any).user?.id;
      
      const candidatura = await ProcessoSeletivoService.moverCandidato(
        vagaId, 
        candidatoId, 
        novaEtapa, 
        usuarioId
      );
      res.json(candidatura);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao mover candidato" });
    }
  },

  // POST /vaga/:id/candidato/:cid/avaliar - Avaliar candidato
  async avaliarCandidato(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const candidatoId = Number(req.params.cid);
      const { avaliacao, observacoes } = req.body;
      const usuarioId = (req as any).user?.id;
      
      const candidatura = await ProcessoSeletivoService.avaliarCandidato(
        vagaId, 
        candidatoId, 
        avaliacao, 
        observacoes, 
        usuarioId
      );
      res.json(candidatura);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao avaliar candidato" });
    }
  },

  // GET /vaga/:id/candidatos/por-status - Candidatos agrupados por status
  async candidatosPorStatus(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const candidatos = await ProcessoSeletivoService.obterCandidatosPorStatus(vagaId);
      res.json(candidatos);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao obter candidatos" });
    }
  },
};