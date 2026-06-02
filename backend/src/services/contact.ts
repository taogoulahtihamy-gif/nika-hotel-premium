import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
