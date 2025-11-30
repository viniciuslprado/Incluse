//Controllers (HTTP ↔ services)

import { Request, Response } from "express";
import { TiposService } from "../../services/common/tipos.service";

export const TiposController = {
  async list(_req: Request, res: Response) {
    const data = await TiposService.list();
    res.json(data);
  },
  async listWithSubtipos(_req: Request, res: Response) {
    const data = await TiposService.listWithSubtipos();
    res.json(data);
  },
  async listSubtipos(req: Request, res: Response) {
    const tipoId = Number(req.params.id);
    if (!tipoId) return res.status(400).json({ error: 'ID do tipo obrigatório' });
    try {
      const subtipos = await TiposService.listSubtipos(tipoId);
      res.json(subtipos);
    } catch (e: any) {
      res.status(e.status || 500).json({ error: e.message });
    }
  },
  async create(req: Request, res: Response) {
    const { nome } = req.body ?? {};
    const created = await TiposService.create(nome);
    res.status(201).json(created);
  },
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { nome } = req.body ?? {};
    if (!id || !nome) return res.status(400).json({ error: 'ID e nome obrigatórios' });
    try {
      const updated = await TiposService.update(id, nome);
      res.json(updated);
    } catch (e: any) {
      res.status(e.status || 500).json({ error: e.message });
    }
  },
};