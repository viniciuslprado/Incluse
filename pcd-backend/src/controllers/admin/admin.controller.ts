
import { Request, Response } from "express";
import { AdminService } from "../../services/admin/admin.service.js";
import { prisma } from '../../prismaClient.js';

export const AdminController = {
  async listarAdmins(req: Request, res: Response) {
    try {
      const admins = await prisma.administrador.findMany();
      res.json(admins);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao listar admins" });
    }
  },
  async listarEmpresas(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const result = await AdminService.listarEmpresas({
        page: Number(page),
        limit: Number(limit),
        status: status as string
      });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao listar empresas" });
    }
  },

  async atualizarStatusEmpresa(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { isActive } = req.body;
      const empresa = await AdminService.atualizarStatusEmpresa(id, isActive);
      res.json(empresa);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar empresa" });
    }
  },

  async listarCandidatos(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await AdminService.listarCandidatos({
        page: Number(page),
        limit: Number(limit)
      });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao listar candidatos" });
    }
  },

  async listarVagas(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const result = await AdminService.listarVagas({
        page: Number(page),
        limit: Number(limit),
        status: status as string
      });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao listar vagas" });
    }
  },

  async pausarVaga(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const vaga = await AdminService.pausarVaga(id);
      res.json(vaga);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao pausar vaga" });
    }
  },

  async dashboard(req: Request, res: Response) {
    try {
      const stats = await AdminService.getDashboard();
      res.json(stats);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao obter dashboard" });
    }
  },

  async obterLogs(req: Request, res: Response) {
    try {
      const { page = 1, limit = 50, tipo } = req.query;
      const result = await AdminService.obterLogs({
        page: Number(page),
        limit: Number(limit),
        tipo: tipo as string
      });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao obter logs" });
    }
  },
};