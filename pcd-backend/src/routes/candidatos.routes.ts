import { Router } from "express";
import multer from "multer";
import multerConfig from "../config/multer";
import { CandidatosController } from "../controllers/candidatos.controller";
import { SalvasController } from "../controllers/salvas.controller";
const router = Router();
const upload = multer(multerConfig.upload("tmp")).fields([
	{ name: "file", maxCount: 1 },
	{ name: "laudo", maxCount: 1 },
]);

// POST /candidatos → criar candidato (aceita arquivos opcionais 'file' e 'laudo')
router.post("/", upload, CandidatosController.criar);

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
