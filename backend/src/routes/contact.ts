import { Router } from 'express';
import { contactController } from '../controllers/contact';

export const contactRouter = Router();

contactRouter.get('/', contactController.getAll);
contactRouter.post('/', contactController.create);
contactRouter.delete('/:id', contactController.remove);
