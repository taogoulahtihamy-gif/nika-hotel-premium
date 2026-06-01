export const hotel = {
  name: 'NIKA HOTEL',
  tagline: 'Hébergement • Restaurant • Bar',
  location: 'Kamenge, Bujumbura, Burundi',
  address: 'Kamenge, Q. Heha 2AV N°4',
  phone1: '+257 77 482 817',
  phone2: '+257 65 881 210',
  email: 'reservation@nikahotel.com',
  whatsapp: '25777482817',
  currency: 'FBU',
};

export const stats = [
  { value: '24/7', label: 'Réception & assistance' },
  { value: '3', label: 'Services premium' },
  { value: 'VIP', label: 'Expérience garantie' },
  { value: '100%', label: 'Satisfaction client' },
];

export const services = [
  {
    title: 'Hébergement',
    desc: 'Chambres élégantes et suites premium avec literie haut de gamme, climatisation, WiFi haut débit et service en chambre 24h/24.',
    features: ['Chambres Standards', 'Suites Deluxe', 'Suites Premium', 'Room service 24/7'],
  },
  {
    title: 'Restaurant',
    desc: 'Cuisine africaine et internationale dans un cadre raffiné. Petit-déjeuner, déjeuner et dîner sur place ou en chambre.',
    features: ['Spécialités africaines', 'Cuisine internationale', 'Menu 30 000 FBU+', 'Petit-déjeuner 20 000 FBU'],
  },
  {
    title: 'Bar & Lounge',
    desc: 'Ambiance lounge avec cocktails exotiques, vins sélectionnés, bières locales et internationales, et boissons fraîches.',
    features: ['Cocktails premium', 'Vins & champagne', 'Bières locales', 'Soirées privées'],
  },
];

export const rooms = [
  {
    id: 'standard',
    name: 'Chambre Standard',
    price: '80 000',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
    description: 'Chambre confortable avec lit queen size, climatisation, WiFi, télévision écran plat et salle de bain privative. Idéale pour un séjour d\'affaires ou de tourisme.',
    features: ['Lit Queen Size', 'Climatisation', 'WiFi haut débit', 'TV écran plat', 'Salle de bain privative'],
  },
  {
    id: 'deluxe',
    name: 'Chambre Deluxe',
    price: '120 000',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    description: 'Chambre spacieuse avec salon privé, balcon panoramique, mini-bar, petit-déjeuner inclus et vue imprenable sur le quartier.',
    features: ['Salon privé', 'Balcon panoramique', 'Mini-bar', 'Petit-déjeuner inclus', 'Vue imprenable'],
  },
  {
    id: 'premium',
    name: 'Suite Premium',
    price: '180 000',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    description: 'Suite haut de gamme avec espace travail, room service 24/7, accueil personnalisé, équipements VIP et service voiturier.',
    features: ['Espace travail', 'Room service 24/7', 'Accueil VIP', 'Équipements premium', 'Service voiturier'],
  },
];

export const menuItems = [
  { name: 'Petit-déjeuner continental', price: '20 000 FBU' },
  { name: 'Spécialités africaines', price: 'À partir de 30 000 FBU' },
  { name: 'Cuisine internationale', price: 'À partir de 35 000 FBU' },
  { name: 'Plat signature du chef', price: 'Sur demande' },
  { name: 'Menu dégustation', price: 'Sur demande' },
];

export const barItems = [
  { title: 'Cocktails exotiques', text: 'Carte premium avec fruits tropicaux et spiritueux importés.' },
  { title: 'Vins & Champagne', text: 'Sélection de vins rouges, blancs et champagne pour tous les goûts.' },
  { title: 'Bières & Boissons', text: 'Bières locales et internationales, jus frais, sodas et eaux minérales.' },
  { title: 'Ambiance Lounge', text: 'Soirées privées, musique d\'ambiance et service personnalisé.' },
];

export const roomGalleries: Record<string, { src: string; label: string }[]> = {
  standard: [
    { src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80', label: 'Chambre Standard' },
    { src: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80', label: 'Lit Queen Size' },
    { src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', label: 'Salle de bain' },
    { src: 'https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&q=80', label: 'Espace intérieur' },
  ],
  deluxe: [
    { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80', label: 'Suite Deluxe' },
    { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80', label: 'Salon privé' },
    { src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80', label: 'Balcon panoramique' },
    { src: 'https://images.unsplash.com/photo-1562778612-e1e0cda9915c?w=800&q=80', label: 'Coin détente' },
  ],
  premium: [
    { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80', label: 'Suite Premium' },
    { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', label: 'Espace travail' },
    { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', label: 'VIP Lounge' },
    { src: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=800&q=80', label: 'Vue imprenable' },
  ],
};

export const dishGallery = [
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', label: 'Plat Signature' },
  { src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', label: 'Cuisine internationale' },
  { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', label: 'Spécialités africaines' },
  { src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80', label: 'Petit-déjeuner continental' },
];

export const drinkGallery = [
  { src: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80', label: 'Cocktails exotiques' },
  { src: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80', label: 'Vins & Champagne' },
  { src: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80', label: 'Bières & Boissons' },
  { src: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&q=80', label: 'Ambiance Lounge' },
];

export const gallery = [
  { image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', label: 'Hôtel' },
  { image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80', label: 'Suite Presidentielle' },
  { image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80', label: 'Chambre Deluxe' },
  { image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', label: 'Restaurant' },
  { image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80', label: 'Bar' },
];

export const testimonials = [
  { name: 'Alice M.', text: 'Un cadre exceptionnel au cœur de Bujumbura. Le personnel est aux petits soins, les chambres sont impeccables.' },
  { name: 'David K.', text: 'Le restaurant est une vraie découverte. La cuisine africaine est savoureuse et le cadre est élégant.' },
  { name: 'Sarah N.', text: 'Le bar lounge est parfait pour se détendre après une journée de travail. Je recommande vivement.' },
];
