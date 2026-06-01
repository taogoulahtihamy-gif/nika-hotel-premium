import { Router } from 'express';
import { reservationController } from '../controllers/reservations';

export const reservationRouter = Router();

reservationRouter.get('/', reservationController.getAll);
reservationRouter.post('/', reservationController.create);
reservationRouter.patch('/:id/status', reservationController.updateStatus);
reservationRouter.delete('/:id', reservationController.remove);
