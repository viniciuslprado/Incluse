import { Router } from 'express';
import { adminCompaniesController } from '../../controllers/admin/adminCompaniesController.js';
import { ensureRole } from '../../middleware/auth';

const router = Router();

router.get('/empresas', ensureRole('admin'), adminCompaniesController.list);
router.patch('/empresas/:id/status', ensureRole('admin'), adminCompaniesController.updateStatus);

export default router;
