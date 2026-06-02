const menu = [
  { name: 'Petit-déjeuner continental', price: 20000, category: 'Petit-déjeuner' },
  { name: 'Café', price: 5000, category: 'Petit-déjeuner' },
  { name: 'Thé', price: 4000, category: 'Petit-déjeuner' },
  { name: 'Plat du jour', price: 30000, category: 'Restaurant' },
  { name: 'Poulet grillé', price: 35000, category: 'Restaurant' },
  { name: 'Riz sauté', price: 25000, category: 'Restaurant' },
  { name: 'Cocktail maison', price: 18000, category: 'Bar' },
  { name: 'Vin rouge', price: 25000, category: 'Bar' },
  { name: 'Bière locale', price: 8000, category: 'Bar' },
  { name: 'Eau minérale', price: 3000, category: 'Boissons' },
  { name: 'Jus naturel', price: 7000, category: 'Boissons' },
  { name: 'Soda', price: 5000, category: 'Boissons' },
  { name: 'Serviettes supplémentaires', price: 0, category: 'Service Chambre' },
  { name: 'Nettoyage chambre', price: 0, category: 'Service Chambre' },
  { name: 'Changement draps', price: 0, category: 'Service Chambre' },
  { name: 'Appeler réception', price: 0, category: 'Réception' },
  { name: 'Demander assistance', price: 0, category: 'Réception' },
];

const orders: any[] = [];
let nextId = 1;

function generateOrderNumber(id: number): string {
  return 'CMD-' + String(id).padStart(3, '0');
}

export const roomServiceOrderService = {
  getMenu() {
    return menu;
  },

  getAll() {
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getByRoom(roomNumber: string) {
    return orders
      .filter((o) => o.roomNumber === roomNumber)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getByOrderNumber(orderNumber: string) {
    return orders.find((o) => o.orderNumber === orderNumber) || null;
  },

  getById(id: number) {
    return orders.find((o) => o.id === id) || null;
  },

  create(data: {
    roomNumber: string;
    items: string;
    total: number;
    message?: string;
  }) {
    const id = nextId++;
    const order = {
      id,
      orderNumber: generateOrderNumber(id),
      roomNumber: data.roomNumber,
      items: data.items,
      total: data.total,
      message: data.message ?? null,
      status: 'received',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.push(order);
    return order;
  },

  updateStatus(id: number, status: string) {
    const order = orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  },

  remove(id: number) {
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    return orders.splice(idx, 1)[0];
  },
};
