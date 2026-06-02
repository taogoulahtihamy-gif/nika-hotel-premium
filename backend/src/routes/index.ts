import { Router } from 'express';
import { reservationRouter } from './reservations';
import { roomsRouter } from './rooms';
import { contactRouter } from './contact';
import { authRouter } from './auth';
import { uploadRouter } from './upload';
import { roomServiceRouter } from './roomService';

export const apiRouter = Router();
apiRouter.get('/health', (_, res) => res.json({ ok: true, service: 'nika-hotel-api' }));
apiRouter.use('/reservations', reservationRouter);
apiRouter.use('/rooms', roomsRouter);
apiRouter.use('/contact', contactRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/upload', uploadRouter);
apiRouter.use('/room-service', roomServiceRouter);
