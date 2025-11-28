import { Router } from 'express';
import { adminDashboardController } from '../../controllers/admin/adminDashboardController.js';
import { ensureRole } from '../../middleware/auth';

const router = Router();

router.get('/dashboard', ensureRole('admin'), adminDashboardController.getDashboard);

export default router;
