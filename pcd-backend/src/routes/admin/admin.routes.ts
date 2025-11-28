import { Router } from "express";
import { AdministradoresController } from "../../controllers/admin/administradores.controller";
import { verifyJWT, ensureRole } from "../../middleware/auth";

const router = Router();

// Todas as rotas exigem autenticação e role admin
router.use(verifyJWT, ensureRole('admin'));

// CRUD de administradores
router.post("/usuarios", AdministradoresController.criar);
router.get("/usuarios", AdministradoresController.listar);
router.get("/usuarios/:id", AdministradoresController.detalhar);
router.put("/usuarios/:id", AdministradoresController.atualizar);
router.delete("/usuarios/:id", AdministradoresController.deletar);

export default router;
