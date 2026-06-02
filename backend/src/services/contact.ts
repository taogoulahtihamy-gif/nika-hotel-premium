import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

export const contactService = {
  async getAll() {
    return prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async create(data: { name: string; email?: string; subject?: string; message: string }) {
    return prisma.contactMessage.create({ data });
  },

  async remove(id: number) {
    return prisma.contactMessage.delete({ where: { id } });
  },
};
