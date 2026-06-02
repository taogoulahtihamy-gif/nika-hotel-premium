import { PrismaClient, ReservationStatus } from '@prisma/client';

const prisma = new PrismaClient();

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
    adults: number;
    children?: number;
    roomType: string;
    message?: string;
  }) {
    return prisma.reservation.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email ?? null,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        adults: data.adults,
        children: data.children ?? 0,
        roomType: data.roomType,
        message: data.message ?? null,
        status: ReservationStatus.pending,
      },
    });
  },

  async update(id: number, data: Partial<{
    fullName: string;
    phone: string;
    email: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    roomType: string;
    message: string;
    status: ReservationStatus;
  }>) {
    const updateData: any = { ...data };
    if (data.checkIn) updateData.checkIn = new Date(data.checkIn);
    if (data.checkOut) updateData.checkOut = new Date(data.checkOut);
    return prisma.reservation.update({ where: { id }, data: updateData });
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

  async getStats() {
    const [total, pending, confirmed, cancelled, completed] = await Promise.all([
      prisma.reservation.count(),
      prisma.reservation.count({ where: { status: 'pending' } }),
      prisma.reservation.count({ where: { status: 'confirmed' } }),
      prisma.reservation.count({ where: { status: 'cancelled' } }),
      prisma.reservation.count({ where: { status: 'completed' } }),
    ]);
    const rooms = await prisma.reservation.groupBy({
      by: ['roomType'],
      _count: { roomType: true },
      orderBy: { _count: { roomType: 'desc' } },
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayReservations = await prisma.reservation.count({
      where: { createdAt: { gte: today, lt: tomorrow } },
    });
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthReservations = await prisma.reservation.count({
      where: { createdAt: { gte: monthStart } },
    });
    return { total, pending, confirmed, cancelled, completed, rooms, todayReservations, monthReservations };
  },
};
