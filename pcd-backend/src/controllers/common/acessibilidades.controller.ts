import { Request, Response } from "express";
import { AcessService } from "../../services/common/acessibilidades.service";

export const AcessibilidadesController = {
  async list(_req: Request, res: Response) {
    const data = await AcessService.list();
    res.json(data);
  },
  async create(req: Request, res: Response) {
    const { descricao } = req.body ?? {};
    const created = await AcessService.create(descricao);
    res.status(201).json(created);
  },
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { descricao } = req.body ?? {};
    if (!id || !descricao) return res.status(400).json({ error: 'ID e descrição obrigatórios' });
    try {
      const updated = await AcessService.update(id, descricao);
      res.json(updated);
    } catch (e: any) {
      res.status(e.status || 500).json({ error: e.message });
    }
  },
  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID obrigatório' });
    try {
      await AcessService.delete(id);
      res.status(204).send();
    } catch (e: any) {
      res.status(e.status || 500).json({ error: e.message });
    }
  },
};