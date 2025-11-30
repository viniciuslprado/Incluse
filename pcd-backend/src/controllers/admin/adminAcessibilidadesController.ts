
import { Request, Response } from 'express';
import { adminAcessibilidadesService } from '../../services/admin/adminAcessibilidadesService.js';

export const adminAcessibilidadesController = {
  async listar(req: Request, res: Response) {
    const acess = await adminAcessibilidadesService.listar();
    res.json(acess);
  },

  async listarPorBarreira(req: Request, res: Response) {
    const barreiraId = Number(req.params.barreiraId);
    if (!barreiraId) return res.status(400).json({ error: 'barreiraId obrigatório' });
    const acess = await adminAcessibilidadesService.listarPorBarreira(barreiraId);
    res.json(acess);
  },
  async criar(req: Request, res: Response) {
    const a = await adminAcessibilidadesService.criar(req.body.nome);
    res.status(201).json(a);
  },
  async atualizar(req: Request, res: Response) {
    const a = await adminAcessibilidadesService.atualizar(Number(req.params.id), req.body.nome);
    res.json(a);
  },
  async deletar(req: Request, res: Response) {
    await adminAcessibilidadesService.deletar(Number(req.params.id));
    res.status(204).send();
  }
};
