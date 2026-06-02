import { Request, Response } from 'express';
import { z } from 'zod';
import { contactService } from '../services/contact';

const createSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  email: z.string().email().optional().or(z.literal('')),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message requis'),
});

function parseId(req: Request): number | null {
  const id = parseInt(String(req.params.id), 10);
  return isNaN(id) ? null : id;
}

export const contactController = {
  async getAll(_req: Request, res: Response) {
    try {
      const messages = await contactService.getAll();
      return res.json({ data: messages });
    } catch (err) {
      return res.status(500).json({ message: 'Erreur lors de la récupération des messages' });
    }
  },

  async create(req: Request, res: Response) {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Données invalides', errors: parsed.error.flatten() });
    }
    try {
      const message = await contactService.create(parsed.data);
      return res.status(201).json({ data: message });
    } catch (err) {
      return res.status(500).json({ message: 'Erreur lors de la création du message' });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = parseId(req);
      if (!id) return res.status(400).json({ message: 'ID invalide' });
      await contactService.remove(id);
      return res.json({ message: 'Message supprimé' });
    } catch (err) {
      return res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
  },
};
