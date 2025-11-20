import { Request, Response } from "express";
import prisma from "../prismaClient";

export class SalvasController {
  static async listar(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    if (!candidatoId) return res.status(400).json({ error: "Candidato inválido" });
    const itens = await prisma.vagaSalva.findMany({ where: { candidatoId } });
    // Retorna formato simples [{ id: vagaId }, ...] para manter compatibilidade com frontend
    return res.json(itens.map((i: any) => ({ id: i.vagaId })));
  }

  static async salvar(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const vagaId = Number(req.params.vagaId);
    if (!candidatoId || !vagaId) return res.status(400).json({ error: "Dados inválidos" });
    try {
      const created = await prisma.vagaSalva.create({ data: { candidatoId, vagaId } });
      return res.status(201).json({ candidatoId: created.candidatoId, vagaId: created.vagaId });
    } catch (err: any) {
      // possivelmente já existe -> retorna 409
      console.error(err);
      return res.status(500).json({ error: err?.message ?? "Erro ao salvar vaga" });
    }
  }

  static async remover(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const vagaId = Number(req.params.vagaId);
    try {
      await prisma.vagaSalva.delete({ where: { candidatoId_vagaId: { candidatoId, vagaId } } });
      return res.status(204).send();
    } catch (err: any) {
      console.error(err);
      return res.status(404).json({ error: "Não encontrado" });
    }
  }
}
