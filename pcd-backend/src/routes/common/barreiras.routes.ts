import { Router } from "express";
import { BarreirasController } from "../../controllers/common/barreiras.controller";
const router = Router();


import { verifyJWT, ensureRole } from "../../middleware/auth";

router.get("/", BarreirasController.list);  // /barreiras
router.post("/", verifyJWT, ensureRole('admin'), BarreirasController.create);

export default router;
