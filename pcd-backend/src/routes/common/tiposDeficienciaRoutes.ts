import { Router } from 'express';
import { adminDeficienciasController } from '../../controllers/admin/adminDeficienciasController.js';
const router = Router();
router.get('/', adminDeficienciasController.listar);
export default router;
