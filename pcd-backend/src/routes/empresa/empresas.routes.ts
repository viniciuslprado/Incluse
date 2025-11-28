import { Router } from "express";
import { EmpresasController } from "../../controllers/empresa/empresas.controller";
import { verifyJWT, ensureRole } from "../../middleware/auth";
import { uploadLogo } from "../../middleware/upload";

const r = Router();

// Rotas públicas (ordem importa: rotas específicas antes de ":id")
r.get("/", EmpresasController.listar);
r.post("/", EmpresasController.criar);

// Validation endpoints (public, for real-time checking)
r.get("/check-cnpj/:cnpj", EmpresasController.checkCnpj);
r.get("/check-email/:email", EmpresasController.checkEmail);

// Rotas protegidas (requerem autenticação como empresa)
r.get("/me", verifyJWT, ensureRole('empresa'), EmpresasController.obterPerfil);
r.put("/update", verifyJWT, ensureRole('empresa'), EmpresasController.atualizarPerfil);
r.post("/logo", verifyJWT, ensureRole('empresa'), uploadLogo.single('logo'), EmpresasController.uploadLogo);
r.get("/configuracoes", verifyJWT, ensureRole('empresa'), EmpresasController.obterConfiguracoes);
r.put("/configuracoes", verifyJWT, ensureRole('empresa'), EmpresasController.atualizarConfiguracoes);

// Rotas por ID (deixe por último para não capturar "/me" e outras específicas)
r.get("/:id", EmpresasController.detalhar);

// Rota genérica de atualização (por ID)
r.put("/:id", EmpresasController.atualizar);

// Avaliações (temporário: endpoint que aceita avaliação e retorna 201)
// r.post("/:id/avaliacoes", AvaliacoesController.criar); // Removido: controller não existe

export default r;
