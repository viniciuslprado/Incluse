import { Router } from "express";
import { MatchController } from "../controllers/match.controller";

const router = Router();

// GET /match/candidato/:id
router.get("/candidato/:id", MatchController.matchCandidato);

export default router;
