import { Router } from 'express';
import { ensureRole } from '../../middleware/auth';
import { adminDeficienciasController } from '../../controllers/admin/adminDeficienciasController.js';

const router = Router();
router.use(ensureRole('admin'));

router.get('/', adminDeficienciasController.listar);
router.post('/', adminDeficienciasController.criar);
router.patch('/:id', adminDeficienciasController.atualizar);
router.delete('/:id', adminDeficienciasController.deletar);

// Subtipos
router.get('/:id/subtipos', adminDeficienciasController.listarSubtipos);

export default router;
