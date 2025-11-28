import { Router } from 'express';
import { adminLogsController } from '../../controllers/admin/adminLogsController.js';
import { ensureRole } from '../../middleware/auth';

const router = Router();

router.get('/logs', ensureRole('admin'), adminLogsController.list);

export default router;
