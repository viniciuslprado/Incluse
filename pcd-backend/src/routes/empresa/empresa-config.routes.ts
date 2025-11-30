import { Router } from "express";
import { EmpresaConfigController } from "../../controllers/empresa/empresa-config.controller";
import { verifyJWT, ensureRole } from "../../middleware/auth";

const r = Router();

// Preferências de notificação da empresa autenticada
r.get("/configuracoes", verifyJWT, ensureRole('empresa'), EmpresaConfigController.getConfig);
r.put("/configuracoes", verifyJWT, ensureRole('empresa'), EmpresaConfigController.updateConfig);

export default r;
