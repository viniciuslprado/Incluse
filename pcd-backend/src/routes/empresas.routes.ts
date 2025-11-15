import { Router } from "express";
import { EmpresasController } from "../controllers/empresas.controller";
import { AvaliacoesController } from "../controllers/avaliacoes.controller";
const r = Router();
r.get("/", EmpresasController.listar);
r.get("/:id", EmpresasController.detalhar);
r.post("/", EmpresasController.criar);

// avaliações (temporário: endpoint que aceita avaliação e retorna 201)
r.post("/:id/avaliacoes", AvaliacoesController.criar);
export default r;
