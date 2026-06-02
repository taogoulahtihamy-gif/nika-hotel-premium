import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@nikahotel.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export const authService = {
  async seedAdmin() {
    const existing = await prisma.admin.findUnique({ where: { email: ADMIN_EMAIL } });
    if (!existing) {
      await prisma.admin.create({
        data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: 'Admin' },
      });
    }
  },

  async login(email: string, password: string) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || admin.password !== password) return null;
    return { id: admin.id, email: admin.email, name: admin.name };
  },
};
