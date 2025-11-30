import { Router } from 'express';
import { ensureRole } from '../../middleware/auth';
import { adminBarreirasController } from '../../controllers/admin/adminBarreirasController.js';

const router = Router();
router.use(ensureRole('admin'));

router.get('/', adminBarreirasController.listar);
// Lista barreiras vinculadas a um subtipo
router.get('/por-subtipo/:subtipoId', adminBarreirasController.listarPorSubtipo);
router.post('/', adminBarreirasController.criar);
router.patch('/:id', adminBarreirasController.atualizar);
router.delete('/:id', adminBarreirasController.deletar);

export default router;
