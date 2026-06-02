export type Order = {
  id: number;
  orderNumber: string;
  roomNumber: string;
  items: string;
  total: number;
  message: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export const statusSteps = [
  { key: 'received', label: 'Reçue', emoji: '✅' },
  { key: 'preparing', label: 'Préparation', emoji: '👨‍🍳' },
  { key: 'delivery', label: 'Livraison', emoji: '🛵' },
  { key: 'delivered', label: 'Livrée', emoji: '🎉' },
];

export const statusIndex: Record<string, number> = {
  received: 0,
  preparing: 1,
  delivery: 2,
  delivered: 3,
};

export const statusLabels: Record<string, string> = {
  received: 'Commande reçue par la réception',
  preparing: 'Votre commande est en cours de préparation',
  delivery: 'Votre commande est en cours de livraison',
  delivered: 'Votre commande a été livrée',
};

export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
