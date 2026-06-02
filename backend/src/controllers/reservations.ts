import { Request, Response } from 'express';
import { z } from 'zod';
import { reservationService } from '../services/reservations';
import { ReservationStatus } from '@prisma/client';

const createSchema = z.object({
  fullName: z.string().min(2, 'Nom trop court'),
  phone: z.string().min(6, 'Téléphone invalide'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  checkIn: z.string().min(1, "Date d'arrivée requise"),
  checkOut: z.string().min(1, 'Date de départ requise'),
  adults: z.number().min(1, 'Au moins 1 adulte'),
  children: z.number().min(0).optional(),
  roomType: z.string().min(1, 'Type de chambre requis'),
  message: z.string().optional(),
});

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(6).optional(),
  email: z.string().email().optional().or(z.literal('')),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  adults: z.number().min(1).optional(),
  children: z.number().min(0).optional(),
  roomType: z.string().optional(),
  message: z.string().optional(),
  status: z.nativeEnum(ReservationStatus).optional(),
});

function parseId(req: Request): number | null {
  const id = parseInt(String(req.params.id), 10);
  return isNaN(id) ? null : id;
}

export const reservationController = {
  async getAll(_req: Request, res: Response) {
    try {
      const reservations = await reservationService.getAll();
      return res.json({ data: reservations });
    } catch (err) {
      console.error('Error fetching reservations:', err);
      return res.status(500).json({ message: 'Erreur lors de la récupération des réservations' });
    }
  },

  async create(req: Request, res: Response) {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: parsed.error.flatten(),
      });
    }

    try {
      const reservation = await reservationService.create(parsed.data);
      return res.status(201).json({ data: reservation });
    } catch (err) {
      console.error('Error creating reservation:', err);
      return res.status(500).json({ message: 'Erreur lors de la création de la réservation' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req);
      if (!id) return res.status(400).json({ message: 'ID invalide' });

      const parsed = updateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Données invalides', errors: parsed.error.flatten() });
      }

      const reservation = await reservationService.update(id, parsed.data);
      return res.json({ data: reservation });
    } catch (err) {
      console.error('Error updating reservation:', err);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      const id = parseId(req);
      if (!id) return res.status(400).json({ message: 'ID invalide' });

      const { status } = req.body;
      if (!Object.values(ReservationStatus).includes(status)) {
        return res.status(400).json({ message: 'Statut invalide' });
      }

      const reservation = await reservationService.updateStatus(id, status as ReservationStatus);
      return res.json({ data: reservation });
    } catch (err) {
      console.error('Error updating reservation status:', err);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = parseId(req);
      if (!id) return res.status(400).json({ message: 'ID invalide' });

      await reservationService.remove(id);
      return res.json({ message: 'Réservation supprimée' });
    } catch (err) {
      console.error('Error deleting reservation:', err);
      return res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
  },

  async getStats(_req: Request, res: Response) {
    try {
      const stats = await reservationService.getStats();
      return res.json({ data: stats });
    } catch (err) {
      console.error('Error fetching stats:', err);
      return res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }
  },
};
