import { Request, Response } from "express";
import { VagasRepo } from "../repositories/vagas.repo";
import { VagasService } from "../services/vagas.service";

export const VagasController = {
  async listar(req: Request, res: Response) {
    try {
      const empresaId = Number(req.params.id); // pegando da URL /empresa/:id
      const data = await VagasRepo.list(empresaId);
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao listar vagas" });
    }
  },

  async detalhar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const vaga = await VagasRepo.findById(id);
    if (!vaga) return res.status(404).json({ error: "Vaga não encontrada" });

    // “achatar” as N:N para resposta mais amigável
    const subtipos = vaga.subtiposAceitos.map((vs) => vs.subtipo);
    const acessibilidades = vaga.acessibilidades.map((va) => va.acessibilidade);

    res.json({
      id: vaga.id,
      descricao: vaga.descricao,
      escolaridade: vaga.escolaridade,
      empresa: vaga.empresa,
      subtipos,
      acessibilidades,
    });
  },

  async criar(req: Request, res: Response) {
    try {
      const { empresaId, titulo, descricao, escolaridade, cidade, estado } = req.body;
      const vaga = await VagasService.criarVaga(Number(empresaId), titulo, descricao, escolaridade, cidade, estado);
      res.status(201).json(vaga);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao criar vaga" });
    }
  },

  async vincularSubtipos(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const { subtipoIds } = req.body as { subtipoIds: number[] };
      await VagasService.vincularSubtipos(vagaId, subtipoIds);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao vincular subtipos" });
    }
  },

  async vincularAcessibilidades(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const { acessibilidadeIds } = req.body as { acessibilidadeIds: number[] };
      await VagasService.vincularAcessibilidades(vagaId, acessibilidadeIds);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao vincular acessibilidades" });
    }
  },
};