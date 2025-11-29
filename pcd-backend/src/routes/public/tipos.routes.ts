import { Router } from "express";
import { TiposController } from "../../controllers/common/tipos.controller";
const router = Router();

// Rota pública para tipos com subtipos
router.get("/com-subtipos", TiposController.listWithSubtipos); // /public/tipos/com-subtipos

export default router;
