import { Router } from "express";
import { AdministradoresController } from "../../controllers/admin/administradores.controller";
import { verifyJWT, ensureRole } from "../../middleware/auth";

const router = Router();

// Criar novo admin
router.post("/", ensureRole('admin'), AdministradoresController.criar);
// Listar todos admins
router.get("/", ensureRole('admin'), AdministradoresController.listar);
// Detalhar admin
router.get("/:id", ensureRole('admin'), AdministradoresController.detalhar);
// Atualizar admin
router.put("/:id", ensureRole('admin'), AdministradoresController.atualizar);
// Deletar admin
router.delete("/:id", ensureRole('admin'), AdministradoresController.deletar);

export default router;
