'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const allImages = [
  { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', label: 'Hôtel', category: 'hotel' },
  { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80', label: 'Suite Presidentielle', category: 'chambres' },
  { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80', label: 'Chambre Deluxe', category: 'chambres' },
  { src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80', label: 'Chambre Standard', category: 'chambres' },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80', label: 'Restaurant', category: 'restaurant' },
  { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80', label: 'Cuisine', category: 'restaurant' },
  { src: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80', label: 'Bar', category: 'bar' },
  { src: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1200&q=80', label: 'Cocktails', category: 'bar' },
  { src: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=1200&q=80', label: 'Lobby', category: 'hotel' },
  { src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80', label: 'Balcon', category: 'chambres' },
  { src: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51e6a?w=1200&q=80', label: 'Entrée', category: 'hotel' },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80', label: 'Plat Signature', category: 'restaurant' },
];

const categories = ['toutes', 'hotel', 'chambres', 'restaurant', 'bar'];

export default function GalleryPage() {
  const [active, setActive] = useState('toutes');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === 'toutes' ? allImages : allImages.filter((img) => img.category === active);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prevImage = () => setLightbox((l) => (l !== null ? (l - 1 + filtered.length) % filtered.length : null));
  const nextImage = () => setLightbox((l) => (l !== null ? (l + 1) % filtered.length : null));

  return (
    <>
      <div className="morphing-bg" aria-hidden="true">
        <div className="morphing-shape" />
        <div className="morphing-shape" />
        <div className="morphing-shape" />
      </div>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=1920&q=80)' }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1 className="display-text">Galerie<br/>NIKA HOTEL</h1>
          <p>Découvrez notre établissement à travers ces visuels.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn${active === cat ? ' active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <motion.div
            className="gallery-page"
            layout
          >
            {filtered.map((img, i) => (
              <motion.div
                key={img.src}
                className="gallery-item-page"
                style={{ backgroundImage: `url(${img.src})` }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                layout
                onClick={() => openLightbox(i)}
              >
                <span className="gallery-label">{img.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Fermer">&times;</button>
            <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Précédent">&lsaquo;</button>
            <motion.img
              key={filtered[lightbox].src}
              src={filtered[lightbox].src}
              alt={filtered[lightbox].label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Suivant">&rsaquo;</button>
            <div className="lightbox-counter">{lightbox + 1} / {filtered.length}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
