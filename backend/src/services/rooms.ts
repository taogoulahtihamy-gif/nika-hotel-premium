import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

export const roomService = {
  async getAll() {
    return prisma.room.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async getById(id: number) {
    return prisma.room.findUnique({ where: { id } });
  },

  async getBySlug(slug: string) {
    return prisma.room.findUnique({ where: { slug } });
  },

  async create(data: {
    name: string;
    slug: string;
    description: string;
    price?: number;
    currency?: string;
    capacity?: number;
    imageUrl?: string;
  }) {
    return prisma.room.create({ data });
  },

  async update(id: number, data: Partial<{
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    capacity: number;
    imageUrl: string;
    isAvailable: boolean;
  }>) {
    return prisma.room.update({ where: { id }, data });
  },

  async remove(id: number) {
    return prisma.room.delete({ where: { id } });
  },
};
