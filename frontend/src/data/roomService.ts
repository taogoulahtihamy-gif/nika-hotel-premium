export type MenuItem = {
  name: string;
  price: number;
  category: string;
};

export const menuCategories = [
  { id: 'petit-dejeuner', label: 'Petit-déjeuner', emoji: '🥐' },
  { id: 'restaurant', label: 'Restaurant', emoji: '🍽️' },
  { id: 'bar', label: 'Bar', emoji: '🍸' },
  { id: 'boissons', label: 'Boissons', emoji: '🥤' },
  { id: 'service-chambre', label: 'Service chambre', emoji: '🛎️' },
  { id: 'reception', label: 'Réception', emoji: '📞' },
];

export const menuItems: MenuItem[] = [
  { name: 'Petit-déjeuner continental', price: 20000, category: 'petit-dejeuner' },
  { name: 'Café', price: 5000, category: 'petit-dejeuner' },
  { name: 'Thé', price: 4000, category: 'petit-dejeuner' },
  { name: 'Plat du jour', price: 30000, category: 'restaurant' },
  { name: 'Poulet grillé', price: 35000, category: 'restaurant' },
  { name: 'Riz sauté', price: 25000, category: 'restaurant' },
  { name: 'Cocktail maison', price: 18000, category: 'bar' },
  { name: 'Vin rouge', price: 25000, category: 'bar' },
  { name: 'Bière locale', price: 8000, category: 'bar' },
  { name: 'Eau minérale', price: 3000, category: 'boissons' },
  { name: 'Jus naturel', price: 7000, category: 'boissons' },
  { name: 'Soda', price: 5000, category: 'boissons' },
  { name: 'Serviettes supplémentaires', price: 0, category: 'service-chambre' },
  { name: 'Nettoyage chambre', price: 0, category: 'service-chambre' },
  { name: 'Changement draps', price: 0, category: 'service-chambre' },
  { name: 'Appeler réception', price: 0, category: 'reception' },
  { name: 'Demander assistance', price: 0, category: 'reception' },
];

export type CartItem = {
  name: string;
  price: number;
  quantity: number;
  category: string;
};
