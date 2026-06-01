import { PrismaClient, ReservationStatus } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

export const reservationService = {
  async getAll() {
    return prisma.reservation.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async getById(id: number) {
    return prisma.reservation.findUnique({ where: { id } });
  },

  async create(data: {
    fullName: string;
    phone: string;
    email?: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    roomType: string;
    notes?: string;
  }) {
    return prisma.reservation.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email ?? null,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: data.guests,
        roomType: data.roomType,
        notes: data.notes ?? null,
        status: ReservationStatus.pending,
      },
    });
  },

  async updateStatus(id: number, status: ReservationStatus) {
    return prisma.reservation.update({
      where: { id },
      data: { status },
    });
  },

  async remove(id: number) {
    return prisma.reservation.delete({ where: { id } });
  },
};
