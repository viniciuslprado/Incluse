import { Router } from 'express';
import { ensureRole } from '../../middleware/auth';
import { adminAcessibilidadesController } from '../../controllers/admin/adminAcessibilidadesController.js';

const router = Router();
router.use(ensureRole('admin'));

router.get('/', adminAcessibilidadesController.listar);
// Lista acessibilidades vinculadas a uma barreira
router.get('/por-barreira/:barreiraId', adminAcessibilidadesController.listarPorBarreira);
router.post('/', adminAcessibilidadesController.criar);
router.patch('/:id', adminAcessibilidadesController.atualizar);
router.delete('/:id', adminAcessibilidadesController.deletar);

export default router;
