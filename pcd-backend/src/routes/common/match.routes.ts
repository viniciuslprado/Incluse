import { Router } from "express";
import { MatchController } from "../../controllers/common/match.controller";

const router = Router();

// GET /match/candidato/:id
router.get("/candidato/:id", MatchController.matchCandidato);
// Alias: GET /match/:id (compatibilidade com frontend)
router.get("/:id", MatchController.matchCandidato);

export default router;
