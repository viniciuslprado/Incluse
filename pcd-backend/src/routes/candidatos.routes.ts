import { Router } from "express";
import { CandidatosController } from "../controllers/candidatos.controller";
import { SalvasController } from "../controllers/salvas.controller";
const router = Router();

// POST /candidatos → criar candidato
router.post("/", CandidatosController.criar);

// GET /candidatos/:id
router.get("/:id", CandidatosController.getCandidato);

// GET /candidatos/:id/subtipos
router.get("/:id/subtipos", CandidatosController.listarSubtipos);

// POST /candidatos/:id/subtipos
router.post("/:id/subtipos", CandidatosController.vincularSubtipos);

// POST /candidatos/:id/subtipos/:subtipoId/barreiras
router.post("/:id/subtipos/:subtipoId/barreiras", CandidatosController.vincularBarreiras);

// Vagas salvas (temporário - em memória)
router.get("/:id/salvas", SalvasController.listar);
router.post("/:id/salvas/:vagaId", SalvasController.salvar);
router.delete("/:id/salvas/:vagaId", SalvasController.remover);

export default router;
