import { Router } from 'express';
import { AuthController } from '../../controllers/public/auth.controller';
const r = Router();

r.post('/login', AuthController.login);
r.post('/forgot', AuthController.forgot);
r.post('/reset', AuthController.reset);
r.post('/refresh', AuthController.refresh);
r.post('/dev-token', AuthController.devToken);
r.put('/change-password', AuthController.changePassword);

export default r;
