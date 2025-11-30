import { Router } from "express";
import { TiposController } from "../../controllers/common/tipos.controller";
const router = Router();


import { verifyJWT, ensureRole } from "../../middleware/auth";

router.get("/", TiposController.list);                 // /tipos
router.get("/com-subtipos", TiposController.listWithSubtipos); // /tipos/com-subtipos
router.get("/:id/subtipos", TiposController.listSubtipos); // /tipos/:id/subtipos
router.post("/", verifyJWT, ensureRole('admin'), TiposController.create);              // /tipos
router.put("/:id", verifyJWT, ensureRole('admin'), TiposController.update);            // /tipos/:id

export default router;
