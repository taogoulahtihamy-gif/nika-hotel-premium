import { Router } from 'express';
import { roomController } from '../controllers/rooms';

export const roomsRouter = Router();

roomsRouter.get('/', roomController.getAll);
roomsRouter.get('/:id', roomController.getById);
roomsRouter.post('/', roomController.create);
roomsRouter.put('/:id', roomController.update);
roomsRouter.delete('/:id', roomController.remove);
