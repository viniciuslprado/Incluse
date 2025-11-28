import { Router } from "express";
import { AcessibilidadesController } from "../../controllers/common/acessibilidades.controller";
const router = Router();


import { verifyJWT, ensureRole } from "../../middleware/auth";

router.get("/", AcessibilidadesController.list); // /acessibilidades
router.post("/", verifyJWT, ensureRole('admin'), AcessibilidadesController.create);

export default router;
