import { Router } from "express";
import { CandidaturasController } from "../../controllers/candidato/candidaturas.controller";
import { verifyJWT, ensureSelfCandidate } from "../../middleware/auth";

const r = Router();

// Rotas protegidas - CANDIDATO (usando ensureSelfCandidate para verificar se é o próprio candidato)
r.get("/candidato/:id", verifyJWT, ensureSelfCandidate, CandidaturasController.listarPorCandidato);
r.get("/candidato/:id/dashboard", verifyJWT, ensureSelfCandidate, CandidaturasController.obterDashboard);
r.delete("/vaga/:vagaId/candidato/:candidatoId", verifyJWT, CandidaturasController.retirarCandidatura);
r.get("/vaga/:vagaId/candidato/:candidatoId/verificar", verifyJWT, CandidaturasController.verificarCandidatura);

// Compatibilidade: permitir retirar candidatura via token sem passar candidatoId explicitamente
r.delete('/vaga/:vagaId', verifyJWT, CandidaturasController.retirarCandidatura);

// Criar candidatura - suportar chamada por vagaId no corpo da rota e também rota direta
// POST /candidaturas/:id  (corpo: { candidatoId })
r.post("/:id", verifyJWT, CandidaturasController.criar);

// POST /candidaturas/vaga/:vagaId/candidato/:candidatoId
r.post("/vaga/:vagaId/candidato/:candidatoId", verifyJWT, CandidaturasController.criar);

export default r;