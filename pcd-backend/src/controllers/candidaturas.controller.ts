import { Request, Response } from "express";
import prisma from "../prismaClient";

export class CandidaturasController {
  static async criar(req: Request, res: Response) {
    const vagaId = Number(req.params.id);
    const { candidatoId } = req.body;
    if (!vagaId || !candidatoId) return res.status(400).json({ error: "Dados inválidos" });
    try {
      const created = await prisma.candidatura.create({ data: { vagaId, candidatoId: Number(candidatoId) } });
      return res.status(201).json({ id: created.id, vagaId: created.vagaId, candidatoId: created.candidatoId });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err?.message ?? 'Erro ao registrar candidatura' });
    }
  }
}
