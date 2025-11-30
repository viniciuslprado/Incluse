import { Router } from "express";
import { EmpresaNotificacoesController } from "../../controllers/empresa/empresa-notificacoes.controller";

const router = Router();

// Listar notificações da empresa
router.get("/:id/notificacoes", EmpresaNotificacoesController.listar);
// Marcar notificação como lida
router.patch("/:id/notificacoes/:notifId/lida", EmpresaNotificacoesController.marcarLida);
// Marcar todas como lidas
router.patch("/:id/notificacoes/marcar-todas-lidas", EmpresaNotificacoesController.marcarTodasLidas);

export default router;
