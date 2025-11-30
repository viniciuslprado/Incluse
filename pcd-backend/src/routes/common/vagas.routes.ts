
import { Router } from "express";
import { VagasController } from "../../controllers/common/vagas.controller";
import { CandidaturasController } from "../../controllers/candidato/candidaturas.controller";
import { verifyJWT, ensureRole } from "../../middleware/auth";

const r = Router();

// Rota para obter detalhes de uma vaga pelo id (apenas singular)
r.get("/vaga/:id", VagasController.detalhar);

// Rota pública para listar todas as vagas
r.get("/", VagasController.listarPublicas);


// Rotas protegidas - EMPRESA
r.post("/", verifyJWT, ensureRole('empresa'), VagasController.criar);
r.put("/:id", verifyJWT, ensureRole('empresa'), VagasController.atualizar);
r.patch("/:id/status", verifyJWT, ensureRole('empresa'), VagasController.atualizarStatus);
r.delete("/:id", verifyJWT, ensureRole('empresa'), VagasController.deletar);

// Rotas de candidatos da vaga (apenas empresa)
r.get("/:id/candidatos", verifyJWT, VagasController.listarCandidatos);
r.get("/:id/candidato/:cid/detalhes", verifyJWT, ensureRole('empresa'), VagasController.detalhesCandidato);
r.post("/:id/candidato/:cid/status", verifyJWT, ensureRole('empresa'), VagasController.atualizarStatusCandidato);

// Rotas de gestão avançada
r.post("/duplicar", verifyJWT, ensureRole('empresa'), VagasController.duplicar);

// Filtros e pesquisa

// Listar vagas de uma empresa específica
r.get("/empresa/:empresaId/vagas", verifyJWT, ensureRole('empresa'), VagasController.listarPorEmpresa);

r.get("/empresa/:empresaId/filtros", verifyJWT, ensureRole('empresa'), VagasController.obterFiltros);
r.get("/empresa/:empresaId/pesquisar", verifyJWT, ensureRole('empresa'), VagasController.pesquisar);

// Candidatura (candidato se inscrever em vaga)
r.post("/:id/candidatar", verifyJWT, ensureRole('candidato'), CandidaturasController.criar);

export default r;
