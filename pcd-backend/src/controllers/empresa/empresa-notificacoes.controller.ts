import { Request, Response } from "express";
import { NotificacoesEmpresaService } from "../../services/empresa/notificacoes-empresa.service";

export const EmpresaNotificacoesController = {
  // GET /empresas/:id/notificacoes - Listar notificações
  async listar(req: Request, res: Response) {
    try {
      const empresaId = Number(req.params.id);
      const { page = 1, limit = 20 } = req.query;
      const result = await NotificacoesEmpresaService.listarNotificacoes(empresaId, {
        page: Number(page),
        limit: Number(limit)
      });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao listar notificações" });
    }
  },

  // PATCH /empresas/:id/notificacoes/:notifId/lida - Marcar como lida
  async marcarLida(req: Request, res: Response) {
    try {
      const empresaId = Number(req.params.id);
      const notifId = Number(req.params.notifId);
      await NotificacoesEmpresaService.marcarComoLida(empresaId, notifId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao marcar notificação" });
    }
  },

  // PATCH /empresas/:id/notificacoes/marcar-todas-lidas - Marcar todas como lidas
  async marcarTodasLidas(req: Request, res: Response) {
    try {
      const empresaId = Number(req.params.id);
      await NotificacoesEmpresaService.marcarTodasComoLidas(empresaId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao marcar notificações" });
    }
  },
};
