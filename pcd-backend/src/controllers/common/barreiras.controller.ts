import { Request, Response } from "express";
import { BarreirasService } from "../../services/common/barreiras.service";

export const BarreirasController = {
  async list(_req: Request, res: Response) {
    const data = await BarreirasService.list();
    res.json(data);
  },
  async create(req: Request, res: Response) {
    const { descricao } = req.body ?? {};
    const created = await BarreirasService.create(descricao);
    res.status(201).json(created);
  },

  async listAcessibilidades(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const barreira = await BarreirasService.listAcessibilidades(id);
    if (!barreira) return res.status(404).json({ error: 'Barreira não encontrada' });
    // Retorna só o array de acessibilidades já "achatado"
    const acessibilidades = (barreira.acessibilidades || []).map((ba: any) => ({
      id: ba.acessibilidade.id,
      descricao: ba.acessibilidade.descricao
    }));
    res.json(acessibilidades);
  },
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { descricao } = req.body ?? {};
    if (!id || !descricao) return res.status(400).json({ error: 'ID e descrição obrigatórios' });
    try {
      const updated = await BarreirasService.update(id, descricao);
      res.json(updated);
    } catch (e: any) {
      res.status(e.status || 500).json({ error: e.message });
    }
  },
  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID obrigatório' });
    try {
      await BarreirasService.delete(id);
      res.status(204).send();
    } catch (e: any) {
      res.status(e.status || 500).json({ error: e.message });
    }
  },
};