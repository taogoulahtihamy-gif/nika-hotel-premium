import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    amenities?: string;
  }) {
    return prisma.room.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price ?? null,
        currency: data.currency ?? 'FBU',
        capacity: data.capacity ?? 2,
        imageUrl: data.imageUrl ?? null,
        amenities: data.amenities ?? '',
      },
    });
  },

  async update(id: number, data: Partial<{
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    capacity: number;
    imageUrl: string;
    amenities: string;
    isAvailable: boolean;
  }>) {
    return prisma.room.update({ where: { id }, data });
  },

  async remove(id: number) {
    return prisma.room.delete({ where: { id } });
  },
};
