// src/controllers/match.controller.ts
import { Request, Response } from "express";
import { encontrarVagasCompativeis } from "../services/match.service";

export const MatchController = {
  async listarVagasCompativeis(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.candidatoId);
      if (isNaN(candidatoId)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const vagas = await encontrarVagasCompativeis(candidatoId);
      res.json(vagas);
    } catch (err: any) {
      console.error("Erro ao buscar vagas compatíveis:", err);
      res.status(500).json({ error: err.message ?? "Erro interno no servidor" });
    }
  },
};
