
import { Request, Response } from 'express';
import { adminBarreirasService } from '../../services/admin/adminBarreirasService';

export const adminBarreirasController = {
  async listar(req: Request, res: Response) {
    const barreiras = await adminBarreirasService.listar();
    res.json(barreiras);
  },

  async listarPorSubtipo(req: Request, res: Response) {
    const subtipoId = Number(req.params.subtipoId);
    if (!subtipoId) return res.status(400).json({ error: 'subtipoId obrigatório' });
    const barreiras = await adminBarreirasService.listarPorSubtipo(subtipoId);
    res.json(barreiras);
  },
  async criar(req: Request, res: Response) {
    const b = await adminBarreirasService.criar(req.body.nome);
    res.status(201).json(b);
  },
  async atualizar(req: Request, res: Response) {
    const b = await adminBarreirasService.atualizar(Number(req.params.id), req.body.nome);
    res.json(b);
  },
  async deletar(req: Request, res: Response) {
    await adminBarreirasService.deletar(Number(req.params.id));
    res.status(204).send();
  }
};
