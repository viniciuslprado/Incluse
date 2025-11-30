import { Router } from "express";
import { BarreirasController } from "../../controllers/common/barreiras.controller";
const router = Router();


import { verifyJWT, ensureRole } from "../../middleware/auth";

router.get("/", BarreirasController.list);  // /barreiras
router.get("/:id/acessibilidades", BarreirasController.listAcessibilidades); // /barreiras/:id/acessibilidades
router.post("/", verifyJWT, ensureRole('admin'), BarreirasController.create);
router.put("/:id", verifyJWT, ensureRole('admin'), BarreirasController.update); // /barreiras/:id
router.delete("/:id", verifyJWT, ensureRole('admin'), BarreirasController.delete); // /barreiras/:id

export default router;
