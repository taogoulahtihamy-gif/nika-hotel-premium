'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { rooms, hotel, roomGalleries } from '@/data/site';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] as const } },
};

const roomIcons: Record<string, string> = {
  'Chambre Standard': '🛏️',
  'Chambre Deluxe': '✨',
  'Suite Premium': '👑',
};

export default function RoomsPage() {
  const [roomThumbs, setRoomThumbs] = useState<Record<string, string>>({});
  const wa = `https://wa.me/${hotel.whatsapp}?text=Bonjour%20NIKA%20HOTEL,%20je%20souhaite%20reserver%20une%20chambre.`;

  return (
    <>
      <div className="morphing-bg" aria-hidden="true">
        <div className="morphing-shape" />
        <div className="morphing-shape" />
        <div className="morphing-shape" />
      </div>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1920&q=80)' }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1 className="display-text">Nos Chambres<br/>& Suites</h1>
          <p>Des hébergements conçus pour votre confort, du standard au premium.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <motion.div
            className="rooms rooms-full"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            {rooms.map((r) => {
              const thumbs = roomGalleries[r.id] || [];
              const activeThumb = roomThumbs[r.id] || r.image;

              return (
                <motion.article className="room room-full" key={r.name} variants={item}>
                  <div className="roomVisual" style={{ backgroundImage: `url(${activeThumb})`, position: 'relative' }}>
                    <span style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(6,21,47,0.7)', backdropFilter: 'blur(12px)', padding: '6px 14px', borderRadius: 999, fontSize: 12, color: '#d9a441', fontWeight: 600 }}>
                      {roomIcons[r.name] || '🏨'} {r.name}
                    </span>
                  </div>
                  <div className="room-body">
                    <div className="price">{r.price} <span>{hotel.currency} / nuit</span></div>
                    <p>{r.description}</p>
                    <ul>
                      {r.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    {thumbs.length > 0 && (
                      <div className="room-thumbs">
                        {thumbs.map((t) => (
                          <div
                            key={t.src}
                            className={`room-thumb${activeThumb === t.src ? ' active' : ''}`}
                            style={{ backgroundImage: `url(${t.src})` }}
                            onClick={() => setRoomThumbs((prev) => ({ ...prev, [r.id]: t.src }))}
                            title={t.label}
                          />
                        ))}
                      </div>
                    )}
                    <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer" style={{ marginTop: 16 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Réserver cette chambre
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
