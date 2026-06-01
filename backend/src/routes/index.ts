import { Router } from 'express';
import { reservationRouter } from './reservations';
import { roomsRouter } from './rooms';

export const apiRouter = Router();
apiRouter.get('/health', (_, res) => res.json({ ok: true, service: 'nika-hotel-api' }));
apiRouter.use('/reservations', reservationRouter);
apiRouter.use('/rooms', roomsRouter);
