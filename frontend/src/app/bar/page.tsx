'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { barItems, hotel, drinkGallery } from '@/data/site';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.68, -0.55, 0.265, 1.55] as const } },
};

const barIcons = ['🍸', '🍷', '🍺', '🎵'];

export default function BarPage() {
  const wa = `https://wa.me/${hotel.whatsapp}?text=Bonjour%20NIKA%20HOTEL,%20je%20souhaite%20contacter%20le%20bar.`;

  return (
    <>
      <div className="morphing-bg" aria-hidden="true">
        <div className="morphing-shape" />
        <div className="morphing-shape" />
        <div className="morphing-shape" />
      </div>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1920&q=80)' }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1 className="display-text">Bar<br/>& Lounge</h1>
          <p>Détendez-vous dans une ambiance lounge avec cocktails, vins et boissons fraîches.</p>
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
            <div
              className="restaurant-panel-image"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80)' }}
            />
            <div className="restaurant-panel-text">
              <div style={{ fontSize: 40, marginBottom: 12, lineHeight: 1 }}>🍸</div>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 20 }}>Ambiance lounge & cocktails</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16 }}>
                Notre bar lounge vous accueille dans une atmosphère chaleureuse et sophistiquée.
                Découvrez notre carte de cocktails exotiques, vins sélectionnés et bières locales.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16 }}>
                Que ce soit pour un after-work entre collègues, un rendez-vous ou une soirée privée,
                le bar NIKA HOTEL est l&apos;endroit idéal.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8 }}>
                <strong style={{ color: 'var(--white)' }}>Soirées privées sur réservation — Contactez-nous</strong>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="sectionTitle">
            <h2>Notre carte</h2>
            <div className="section-divider" />
          </div>

          <motion.div
            className="cards cards-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            {barItems.map((i, idx) => (
              <motion.div className="service" key={i.title} variants={item}>
                <div style={{ fontSize: 40, marginBottom: 12, lineHeight: 1 }}>{barIcons[idx]}</div>
                <h3>{i.title}</h3>
                <p>{i.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-inner">
          <div className="sectionTitle">
            <h2>Galerie des Boissons</h2>
            <p>Découvrez notre sélection de cocktails, vins et bières.</p>
            <div className="section-divider" />
          </div>

          <motion.div
            className="drink-grid"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {drinkGallery.map((drink) => (
              <motion.div
                key={drink.label}
                className="drink-card"
                style={{ backgroundImage: `url(${drink.src})` }}
                whileHover={{ scale: 1.03 }}
              >
                <span className="drink-label">{drink.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Contacter le bar
              </a>
              <a className="btn btn-outline" href={`tel:${hotel.phone1}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                Appeler
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
