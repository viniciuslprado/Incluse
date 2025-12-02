
import { Request, Response } from "express";
import { VagasService } from "../../services/common/vagas.service.js";
export const VagasController = {
  // GET /vaga - Listar todas as vagas públicas
  async listarPublicas(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const filters: any = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.areaId) filters.areaId = Number(req.query.areaId);
      if (req.query.modeloTrabalho) filters.modeloTrabalho = req.query.modeloTrabalho;
      const result = await VagasService.listarVagas(undefined, filters, page, limit);
      // Se for uma requisição pública (sem paginação explícita), retorna apenas o array
      if (!req.query.page && !req.query.limit) {
        res.json(result.data);
      } else {
        res.json(result);
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao listar vagas" });
    }
  },
  // POST /vaga - Criar vaga completa
    async criar(req: Request, res: Response) {
    try {
      const vagaData = req.body;
      if (vagaData.areaId) vagaData.areaId = Number(vagaData.areaId);
      const vaga = await VagasService.criarVaga(vagaData);
      res.status(201).json(vaga);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao criar vaga" });
    }
  },

  // GET /vaga/empresas/:empresaId - Listar vagas de uma empresa
  async listarPorEmpresa(req: Request, res: Response) {
    try {
      const empresaId = Number(req.params.empresaId);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100; // Aumentado para retornar todas as vagas por padrão
      const filters: any = {};
      
      if (req.query.status) filters.status = req.query.status;
      if (req.query.areaId) filters.areaId = Number(req.query.areaId);
      if (req.query.modeloTrabalho) filters.modeloTrabalho = req.query.modeloTrabalho;
      
      const result = await VagasService.listarVagas(empresaId, filters, page, limit);
      
      // Se for uma requisição pública (sem paginação explícita), retorna apenas o array
      if (!req.query.page && !req.query.limit) {
        res.json(result.data);
      } else {
        res.json(result);
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao listar vagas" });
    }
  },

  // GET /vaga/:id - Obter detalhes de uma vaga
  async detalhar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const vaga = await VagasService.obterVaga(id);
      res.json(vaga);
    } catch (e: any) {
      const status = e.message === "Vaga não encontrada" ? 404 : 500;
      res.status(status).json({ error: e.message ?? "Erro ao obter vaga" });
    }
  },

  // PUT /vaga/:id - Atualizar vaga
  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const vagaData = req.body;
      if (vagaData.areaId) vagaData.areaId = Number(vagaData.areaId);
      const vaga = await VagasService.atualizarVaga(id, vagaData);
      res.json(vaga);
    } catch (e: any) {
      const status = e.message === "Vaga não encontrada" ? 404 : 400;
      res.status(status).json({ error: e.message ?? "Erro ao atualizar vaga" });
    }
  },

  // PATCH /vaga/:id/status - Atualizar apenas o status
  async atualizarStatus(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      const vaga = await VagasService.atualizarStatus(id, status);
      res.json(vaga);
    } catch (e: any) {
      const statusCode = e.message === "Vaga não encontrada" ? 404 : 400;
      res.status(statusCode).json({ error: e.message ?? "Erro ao atualizar status" });
    }
  },

  // DELETE /vaga/:id - Deletar vaga
  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await VagasService.deletarVaga(id);
      res.status(204).send();
    } catch (e: any) {
      const status = e.message === "Vaga não encontrada" ? 404 : 500;
      res.status(status).json({ error: e.message ?? "Erro ao deletar vaga" });
    }
  },

  // GET /vaga/:id/candidatos - Listar candidatos de uma vaga
  async listarCandidatos(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      
      const result = await VagasService.obterCandidatos(vagaId, page, limit);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao listar candidatos" });
    }
  },

  // GET /vaga/:id/candidato/:cid/detalhes - Obter detalhes de um candidato específico
  async detalhesCandidato(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const candidatoId = Number(req.params.cid);
      
      const candidatura = await VagasService.obterCandidatoDetalhes(vagaId, candidatoId);
      res.json(candidatura);
    } catch (e: any) {
      const status = e.message === "Candidatura não encontrada" ? 404 : 500;
      res.status(status).json({ error: e.message ?? "Erro ao obter detalhes do candidato" });
    }
  },

  // POST /vaga/:id/candidato/:cid/status - Atualizar status de um candidato
  async atualizarStatusCandidato(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const candidatoId = Number(req.params.cid);
      const { status, anotacoes } = req.body;
      console.log('[atualizarStatusCandidato] chamada recebida:', { vagaId, candidatoId, status, anotacoes });
      const candidatura = await VagasService.atualizarStatusCandidato(vagaId, candidatoId, { status, anotacoes });
      console.log('[atualizarStatusCandidato] sucesso, retorno:', candidatura);
      res.json(candidatura);
    } catch (e: any) {
      console.error('[atualizarStatusCandidato] erro:', e);
      res.status(400).json({ error: e.message ?? "Erro ao atualizar status do candidato" });
    }
  },

  // POST /vaga/duplicar - Duplicar vaga
  async duplicar(req: Request, res: Response) {
    try {
      const { vagaId } = req.body;
      const empresaId = (req as any).user?.id;
      const vaga = await VagasService.duplicarVaga(vagaId, empresaId);
      res.status(201).json(vaga);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao duplicar vaga" });
    }
  },


  // GET /vaga/empresas/:empresaId/filtros - Obter opções de filtro
  async obterFiltros(req: Request, res: Response) {
    try {
      const empresaId = Number(req.params.empresaId);
      const filtros = await VagasService.obterFiltros(empresaId);
      res.json(filtros);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao obter filtros" });
    }
  },

  // GET /vaga/empresas/:empresaId/pesquisar - Pesquisar vagas
  async pesquisar(req: Request, res: Response) {
    try {
      const empresaId = Number(req.params.empresaId);
      const { q, status, area, modeloTrabalho, page = 1, limit = 10 } = req.query;
      
      const result = await VagasService.pesquisarVagas(empresaId, {
        termo: q as string,
        status: status as string,
        area: area as string,
        modeloTrabalho: modeloTrabalho as string,
        page: Number(page),
        limit: Number(limit)
      });
      
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao pesquisar vagas" });
    }
  },
};
