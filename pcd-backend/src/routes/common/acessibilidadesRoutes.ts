import { Router } from 'express';
import { adminAcessibilidadesController } from '../../controllers/admin/adminAcessibilidadesController.js';
const router = Router();
router.get('/', adminAcessibilidadesController.listar);
export default router;
