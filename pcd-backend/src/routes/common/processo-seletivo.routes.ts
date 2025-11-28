import { Router } from "express";
import { ProcessoSeletivoController } from "../../controllers/common/processo-seletivo.controller";
import { verifyJWT, ensureRole } from "../../middleware/auth";

const r = Router();

// Todas as rotas requerem autenticação como empresa
r.get("/:id/pipeline", verifyJWT, ensureRole('empresa'), ProcessoSeletivoController.obterPipeline);
r.post("/:id/candidato/:cid/mover", verifyJWT, ensureRole('empresa'), ProcessoSeletivoController.moverCandidato);
r.post("/:id/candidato/:cid/avaliar", verifyJWT, ensureRole('empresa'), ProcessoSeletivoController.avaliarCandidato);
r.get("/:id/candidatos/por-status", verifyJWT, ensureRole('empresa'), ProcessoSeletivoController.candidatosPorStatus);

export default r;