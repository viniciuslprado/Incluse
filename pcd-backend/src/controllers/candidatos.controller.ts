import { Request, Response } from "express";
import { CandidatosService } from "../services/candidatos.service";

export const CandidatosController = {
  async criar(req: Request, res: Response) {
    try {
      const { nome, cpf, telefone, email, escolaridade, senha } = req.body ?? {};
      const c = await CandidatosService.criarCandidato({ nome, cpf, telefone, email, escolaridade, senha });
      res.status(201).json(c);
    } catch (e: any) {
      res.status(e.status || 400).json({ error: e.message ?? 'Erro ao criar candidato' });
    }
  },
  async getCandidato(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = await CandidatosService.getCandidato(id);
    res.json(data);
  },

  async listarSubtipos(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = await CandidatosService.listarSubtipos(id);
    res.json(data);
  },

  async vincularSubtipos(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { subtipoIds } = req.body ?? {};
    const result = await CandidatosService.vincularSubtipos(id, subtipoIds);
    res.json(result);
  },

  async vincularBarreiras(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const subtipoId = Number(req.params.subtipoId);
    const { barreiraIds } = req.body ?? {};
    const result = await CandidatosService.vincularBarreiras(candidatoId, subtipoId, barreiraIds);
    res.json(result);
  },
};
