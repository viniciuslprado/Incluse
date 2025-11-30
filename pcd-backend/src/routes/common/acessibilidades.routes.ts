import { Router } from "express";
import { AcessibilidadesController } from "../../controllers/common/acessibilidades.controller";
const router = Router();


import { verifyJWT, ensureRole } from "../../middleware/auth";

router.get("/", AcessibilidadesController.list); // /acessibilidades
router.post("/", verifyJWT, ensureRole('admin'), AcessibilidadesController.create);
router.put("/:id", verifyJWT, ensureRole('admin'), AcessibilidadesController.update);
router.delete("/:id", verifyJWT, ensureRole('admin'), AcessibilidadesController.delete);

export default router;
