import { Router } from 'express';
import { roomServiceController } from '../controllers/roomService';

export const roomServiceRouter = Router();

roomServiceRouter.get('/menu', roomServiceController.getMenu);
roomServiceRouter.get('/orders', roomServiceController.getAll);
roomServiceRouter.get('/orders/room/:roomNumber', roomServiceController.getByRoom);
roomServiceRouter.post('/orders', roomServiceController.create);
roomServiceRouter.patch('/orders/:id/status', roomServiceController.updateStatus);
roomServiceRouter.delete('/orders/:id', roomServiceController.remove);
