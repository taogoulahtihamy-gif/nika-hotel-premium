import { Request, Response } from 'express';
import { authService } from '../services/auth';

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
      }
      const admin = await authService.login(email, password);
      if (!admin) {
        return res.status(401).json({ message: 'Identifiants incorrects' });
      }
      return res.json({ data: admin });
    } catch (err) {
      return res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  },
};
