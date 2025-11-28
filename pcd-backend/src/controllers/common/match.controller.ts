import { Request, Response } from "express";
import { MatchService } from "../../services/common/match.service";

export const MatchController = {
  async matchCandidato(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    if (!candidatoId) return res.status(400).json({ error: "Invalid candidato id" });

    try {
      const threshold = req.query.threshold ? Number(req.query.threshold) : undefined;
      
      const matches = threshold !== undefined 
        ? await MatchService.matchVagasWithThreshold(candidatoId, threshold)
        : await MatchService.matchVagasForCandidato(candidatoId);
        
      return res.json(matches);
    } catch (err: any) {
      const status = err?.status ?? 500;
      return res.status(status).json({ error: err.message ?? "Internal error" });
    }
  },
};
