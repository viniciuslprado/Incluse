import { Request, Response } from "express";
import { SubtiposService } from "../../services/common/subtipos.service";

export const SubtiposController = {
  async list(_req: Request, res: Response) {
      const data = await SubtiposService.list();
      res.json(data);
    },
  async getOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = await SubtiposService.findDeep(id);
    res.json(data);
  },
  async listBarreiras(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const data = await SubtiposService.listBarreiras(id);
    res.json(data);
  },
  async create(req: Request, res: Response) {
    const { nome, tipoId } = req.body ?? {};
    if (!nome || !tipoId) {
      return res.status(400).json({ error: 'Nome e tipoId são obrigatórios' });
    }
    const created = await SubtiposService.create(nome, Number(tipoId));
    res.status(201).json(created);
  },
};