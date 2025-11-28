import { Router } from 'express';
import { adminCandidatesController } from '../../controllers/admin/adminCandidatesController.js';
import { ensureRole } from '../../middleware/auth';

const router = Router();

router.get('/candidatos', ensureRole('admin'), adminCandidatesController.list);

export default router;
