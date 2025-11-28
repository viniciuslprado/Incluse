import { Router } from "express";
import { SubtiposController } from "../../controllers/common/subtipos.controller";
const router = Router();


import { verifyJWT, ensureRole } from "../../middleware/auth";

router.get("/:id", SubtiposController.getOne); // /subtipos/:id
router.get("/:id/barreiras", SubtiposController.listBarreiras); // /subtipos/:id/barreiras
router.get("/", SubtiposController.list) // /subtipo
router.post("/", verifyJWT, ensureRole('admin'), SubtiposController.create);   // /subtipos

export default router;
