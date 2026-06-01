'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { menuItems, hotel, dishGallery } from '@/data/site';

export default function RestaurantPage() {
  const wa = `https://wa.me/${hotel.whatsapp}?text=Bonjour%20NIKA%20HOTEL,%20je%20souhaite%20reserver%20une%20table%20au%20restaurant.`;

  return (
    <>
      <div className="morphing-bg" aria-hidden="true">
        <div className="morphing-shape" />
        <div className="morphing-shape" />
        <div className="morphing-shape" />
      </div>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80)' }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1 className="display-text">Restaurant<br/>& Cuisine</h1>
          <p>Spécialités africaines et cuisine internationale dans un cadre élégant.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <motion.div
            className="split"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.68, -0.55, 0.265, 1.55] as const }}
          >
            <div className="restaurant-panel-text">
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 20 }}>Une cuisine d&apos;exception</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16 }}>
                Notre chef vous propose une cuisine raffinée mêlant saveurs africaines et influences internationales.
                Chaque plat est préparé avec des ingrédients frais et locaux.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16 }}>
                Que ce soit pour un petit-déjeuner continental à <strong style={{ color: 'var(--gold)' }}>20 000 FBU</strong>,
                un déjeuner d&apos;affaires ou un dîner romantique, notre restaurant vous accueille dans une ambiance élégante.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8 }}>
                <strong style={{ color: 'var(--white)' }}>Menu à partir de 30 000 FBU</strong>
              </p>
            </div>
            <div
              className="restaurant-panel-image"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80)' }}
            />
          </motion.div>
        </div>
      </section>

      <section className="section section-alt" style={{ paddingTop: 100 }}>
        <div className="section-inner">
          <div className="sectionTitle">
            <h2>Galerie Culinaire</h2>
            <p>Découvrez nos plats préparés par notre chef.</p>
            <div className="section-divider" />
          </div>

          <motion.div
            className="dish-grid"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {dishGallery.map((dish) => (
              <motion.div
                key={dish.label}
                className="dish-card"
                style={{ backgroundImage: `url(${dish.src})` }}
                whileHover={{ scale: 1.03 }}
              >
                <span className="dish-label">{dish.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="sectionTitle">
            <h2>Notre Menu</h2>
            <div className="section-divider" />
          </div>

          <motion.div
            className="menu-list-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.68, -0.55, 0.265, 1.55] as const }}
          >
            {menuItems.map((item) => (
              <div className="menu-row-full" key={item.name}>
                <div>
                  <strong>{item.name}</strong>
                </div>
                <span className="menu-price">{item.price}</span>
              </div>
            ))}
          </motion.div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Réserver une table
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
