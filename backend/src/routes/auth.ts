import { Router } from 'express';
import { authController } from '../controllers/auth';

export const authRouter = Router();

authRouter.post('/login', authController.login);
