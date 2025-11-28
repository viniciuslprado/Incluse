import { Request, Response } from "express";
import { NotificacoesService } from "../../services/common/notificacoes.service";

export const NotificacoesController = {
  // GET /candidatos/:id/notificacoes - Listar notificações
  async listar(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const { page = 1, limit = 20 } = req.query;
      const result = await NotificacoesService.listarNotificacoes(candidatoId, {
        page: Number(page),
        limit: Number(limit)
      });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao listar notificações" });
    }
  },

  // PATCH /candidatos/:id/notificacoes/:notifId/lida - Marcar como lida
  async marcarLida(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const notifId = Number(req.params.notifId);
      await NotificacoesService.marcarComoLida(candidatoId, notifId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao marcar notificação" });
    }
  },

  // PATCH /candidatos/:id/notificacoes/marcar-todas-lidas - Marcar todas como lidas
  async marcarTodasLidas(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      await NotificacoesService.marcarTodasComoLidas(candidatoId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao marcar notificações" });
    }
  },

  // GET /candidatos/:id/configuracoes - Obter configurações
  async obterConfiguracoes(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const config = await NotificacoesService.obterConfiguracoes(candidatoId);
      res.json(config);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao obter configurações" });
    }
  },

  // PUT /candidatos/:id/configuracoes - Atualizar configurações
  async atualizarConfiguracoes(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const config = await NotificacoesService.atualizarConfiguracoes(candidatoId, req.body);
      res.json(config);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar configurações" });
    }
  },
};