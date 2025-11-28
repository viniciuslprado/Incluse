import { Router } from "express";
import { EmpresaUsuariosController } from "../../controllers/empresa/empresa-usuarios.controller";
import { verifyJWT, ensureRole } from "../../middleware/auth";

const r = Router();

// Todas as rotas requerem autenticação como empresa
r.get("/", verifyJWT, ensureRole('empresa'), EmpresaUsuariosController.listar);
r.post("/", verifyJWT, ensureRole('empresa'), EmpresaUsuariosController.criar);
r.put("/:id", verifyJWT, ensureRole('empresa'), EmpresaUsuariosController.atualizar);
r.delete("/:id", verifyJWT, ensureRole('empresa'), EmpresaUsuariosController.desativar);

export default r;