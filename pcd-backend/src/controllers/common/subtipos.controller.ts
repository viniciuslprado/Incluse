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
    try {
      const created = await SubtiposService.create(nome, Number(tipoId));
      res.status(201).json(created);
    } catch (e: any) {
      if (e.code === 'P2002' && e.meta?.target?.includes('tipoId') && e.meta?.target?.includes('nome')) {
        return res.status(409).json({ error: 'Já existe um subtipo com esse nome para este tipo de deficiência.' });
      }
      res.status(e.status || 500).json({ error: e.message });
    }
  },
  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    try {
      await SubtiposService.delete(id);
      res.status(204).send();
    } catch (e: any) {
      res.status(e.status || 500).json({ error: e.message });
    }
  },
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { nome } = req.body ?? {};
    if (!id || !nome) return res.status(400).json({ error: 'ID e nome obrigatórios' });
    try {
      const updated = await SubtiposService.update(id, nome);
      res.json(updated);
    } catch (e: any) {
      if (e.code === 'P2002' && e.meta?.target?.includes('tipoId') && e.meta?.target?.includes('nome')) {
        return res.status(409).json({ error: 'Já existe um subtipo com esse nome para este tipo de deficiência.' });
      }
      res.status(e.status || 500).json({ error: e.message });
    }
  },
};