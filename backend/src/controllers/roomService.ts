import { Request, Response } from 'express';
import { z } from 'zod';
import { roomServiceOrderService } from '../services/roomService';

const createSchema = z.object({
  roomNumber: z.string().min(1, 'Numéro de chambre requis'),
  items: z.string().min(1, 'Produits requis'),
  total: z.number().min(0, 'Total invalide'),
  message: z.string().optional(),
});

const statusSchema = z.object({
  status: z.enum(['received', 'preparing', 'delivery', 'delivered']),
});

function parseId(req: Request): number | null {
  const id = parseInt(String(req.params.id), 10);
  return isNaN(id) ? null : id;
}

export const roomServiceController = {
  getMenu(_req: Request, res: Response) {
    return res.json({ data: roomServiceOrderService.getMenu() });
  },

  getAll(_req: Request, res: Response) {
    return res.json({ data: roomServiceOrderService.getAll() });
  },

  getByRoom(req: Request, res: Response) {
    const roomNumber = String(req.params.roomNumber);
    return res.json({ data: roomServiceOrderService.getByRoom(roomNumber) });
  },

  getByOrderNumber(req: Request, res: Response) {
    const orderNumber = String(req.params.orderNumber);
    const order = roomServiceOrderService.getByOrderNumber(orderNumber);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    return res.json({ data: order });
  },

  create(req: Request, res: Response) {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: parsed.error.flatten(),
      });
    }
    const order = roomServiceOrderService.create(parsed.data);
    return res.status(201).json({ data: order });
  },

  updateStatus(req: Request, res: Response) {
    const id = parseId(req);
    if (!id) return res.status(400).json({ message: 'ID invalide' });

    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Statut invalide', errors: parsed.error.flatten() });
    }

    const order = roomServiceOrderService.updateStatus(id, parsed.data.status);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    return res.json({ data: order });
  },

  remove(req: Request, res: Response) {
    const id = parseId(req);
    if (!id) return res.status(400).json({ message: 'ID invalide' });

    const deleted = roomServiceOrderService.remove(id);
    if (!deleted) return res.status(404).json({ message: 'Commande non trouvée' });
    return res.json({ message: 'Commande supprimée' });
  },
};
