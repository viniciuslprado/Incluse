import { Request, Response } from 'express';
import { AreasFormacaoService } from '../../services/common/areas-formacao.service';

export const AreasFormacaoController = {
  async listarTodas(req: Request, res: Response) {
    try {
      const areas = await AreasFormacaoService.listarTodas();
      res.json(areas);
    } catch (error) {
      console.error('Erro ao listar áreas de formação:', error);
      res.status(500).json({ error: 'Erro ao listar áreas de formação' });
    }
  },

  async listarPorCandidato(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.candidatoId);
      if (!candidatoId) {
        return res.status(400).json({ error: 'ID do candidato inválido' });
      }
      const areas = await AreasFormacaoService.listarPorCandidato(candidatoId);
      res.json(areas);
    } catch (error) {
      console.error('Erro ao listar áreas do candidato:', error);
      res.status(500).json({ error: 'Erro ao listar áreas do candidato' });
    }
  },

  async vincularAreas(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.candidatoId);
      const { areaIds } = req.body;

      if (!candidatoId) {
        return res.status(400).json({ error: 'ID do candidato inválido' });
      }

      if (!Array.isArray(areaIds)) {
        return res.status(400).json({ error: 'areaIds deve ser um array' });
      }

      const areas = await AreasFormacaoService.vincularAreasCandidato(candidatoId, areaIds);
      res.json(areas);
    } catch (error) {
      console.error('Erro ao vincular áreas:', error);
      res.status(500).json({ error: 'Erro ao vincular áreas' });
    }
  },
};
