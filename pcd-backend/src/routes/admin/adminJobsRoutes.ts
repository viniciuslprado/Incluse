import { Router } from 'express';
import { adminJobsController } from '../../controllers/admin/adminJobsController.js';
import { ensureRole } from '../../middleware/auth';

const router = Router();

router.get('/vagas', ensureRole('admin'), adminJobsController.list);
router.patch('/vagas/:id/status', ensureRole('admin'), adminJobsController.updateStatus);

export default router;
