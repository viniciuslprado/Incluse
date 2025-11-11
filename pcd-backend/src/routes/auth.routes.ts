import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
const r = Router();

r.post('/login', AuthController.login);

export default r;
