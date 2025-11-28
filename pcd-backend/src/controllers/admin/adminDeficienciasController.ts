import { Request, Response } from 'express';
import { adminDeficienciasService } from '../../services/admin/adminDeficienciasService';

export const adminDeficienciasController = {
  async listar(req: Request, res: Response) {
    const tipos = await adminDeficienciasService.listar();
    res.json(tipos);
  },
  async criar(req: Request, res: Response) {
    const tipo = await adminDeficienciasService.criar(req.body.nome);
    res.status(201).json(tipo);
  },
  async atualizar(req: Request, res: Response) {
    const tipo = await adminDeficienciasService.atualizar(Number(req.params.id), req.body.nome);
    res.json(tipo);
  },
  async deletar(req: Request, res: Response) {
    await adminDeficienciasService.deletar(Number(req.params.id));
    res.status(204).send();
  },
  async listarSubtipos(req: Request, res: Response) {
    const subtipos = await adminDeficienciasService.listarSubtipos(Number(req.params.id));
    res.json(subtipos);
  }
};
