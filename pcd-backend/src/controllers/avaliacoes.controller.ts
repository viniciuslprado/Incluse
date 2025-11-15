import { Request, Response } from "express";
import prisma from "../prismaClient";

export class AvaliacoesController {
  // Persiste avaliação no banco (Prisma)
  static async criar(req: Request, res: Response) {
    const { id } = req.params;
    const { nota, comentario, anonimato } = req.body;
    if (!id) return res.status(400).json({ error: "Empresa id obrigatório" });
    if (typeof nota !== 'number' || nota < 1 || nota > 5) {
      return res.status(400).json({ error: "Nota inválida (1-5)" });
    }
    try {
      const created = await prisma.avaliacao.create({
        data: {
          empresaId: Number(id),
          nota: Math.round(nota),
          comentario: comentario ?? null,
          anonimato: !!anonimato,
        },
      });
      return res.status(201).json(created);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err?.message ?? 'Erro ao salvar avaliação' });
    }
  }
}
