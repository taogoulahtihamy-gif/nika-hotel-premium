import { Request, Response } from 'express';
import { roomService } from '../services/rooms';

function parseId(req: Request): number | null {
  const id = parseInt(String(req.params.id), 10);
  return isNaN(id) ? null : id;
}

export const roomController = {
  async getAll(_req: Request, res: Response) {
    try {
      const rooms = await roomService.getAll();
      return res.json({ data: rooms });
    } catch (err) {
      console.error('Error fetching rooms:', err);
      return res.status(500).json({ message: 'Erreur lors de la récupération des chambres' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req);
      if (!id) return res.status(400).json({ message: 'ID invalide' });

      const room = await roomService.getById(id);
      if (!room) return res.status(404).json({ message: 'Chambre non trouvée' });

      return res.json({ data: room });
    } catch (err) {
      console.error('Error fetching room:', err);
      return res.status(500).json({ message: 'Erreur lors de la récupération de la chambre' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const room = await roomService.create(req.body);
      return res.status(201).json({ data: room });
    } catch (err) {
      console.error('Error creating room:', err);
      return res.status(500).json({ message: 'Erreur lors de la création de la chambre' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req);
      if (!id) return res.status(400).json({ message: 'ID invalide' });

      const room = await roomService.update(id, req.body);
      return res.json({ data: room });
    } catch (err) {
      console.error('Error updating room:', err);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de la chambre' });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = parseId(req);
      if (!id) return res.status(400).json({ message: 'ID invalide' });

      await roomService.remove(id);
      return res.json({ message: 'Chambre supprimée' });
    } catch (err) {
      console.error('Error deleting room:', err);
      return res.status(500).json({ message: 'Erreur lors de la suppression de la chambre' });
    }
  },
};
