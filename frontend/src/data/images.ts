const BASE = '/images/nika';
const FALLBACK = '/images';

export const images = {
  hero: `${BASE}/hero-hotel.jpg`,
  hotel: `${BASE}/hotel-exterior.jpg`,
  rooms: {
    standard: `${BASE}/room-standard.jpg`,
    deluxe: `${BASE}/room-deluxe.jpg`,
    premium: `${BASE}/suite-premium.jpg`,
  },
  restaurant: {
    main: `${BASE}/restaurant-main.jpg`,
    dish1: `${BASE}/dish-1.jpg`,
    dish2: `${BASE}/dish-2.jpg`,
    dish3: `${BASE}/dish-3.jpg`,
  },
  bar: {
    main: `${BASE}/bar-main.jpg`,
    drink1: `${BASE}/drink-1.jpg`,
    drink2: `${BASE}/drink-2.jpg`,
  },
  gallery: [
    `${BASE}/gallery-1.jpg`,
    `${BASE}/gallery-2.jpg`,
    `${BASE}/gallery-3.jpg`,
    `${BASE}/gallery-4.jpg`,
    `${BASE}/gallery-5.jpg`,
  ],
};

export const fallbacks = {
  hero: `${FALLBACK}/hotel.svg`,
  hotel: `${FALLBACK}/hotel.svg`,
  rooms: {
    standard: `${FALLBACK}/room.svg`,
    deluxe: `${FALLBACK}/suite.svg`,
    premium: `${FALLBACK}/prestige.svg`,
  },
  restaurant: `${FALLBACK}/restaurant.svg`,
  bar: `${FALLBACK}/bar.svg`,
  gallery: [
    `${FALLBACK}/hotel.svg`,
    `${FALLBACK}/room.svg`,
    `${FALLBACK}/restaurant.svg`,
    `${FALLBACK}/bar.svg`,
    `${FALLBACK}/suite.svg`,
  ],
};
