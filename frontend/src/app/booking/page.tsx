'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { rooms, hotel } from '@/data/site';

export default function BookingPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: rooms[1].name,
    message: '',
  });

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const waMessage = `Bonjour%20NIKA%20HOTEL,%0A` +
    `Je%20souhaite%20reserver%20une%20chambre.%0A` +
    `Nom%20:%20${encodeURIComponent(form.name)}%0A` +
    `Tel%20:%20${encodeURIComponent(form.phone)}%0A` +
    `Arrivee%20:%20${encodeURIComponent(form.checkIn)}%0A` +
    `Depart%20:%20${encodeURIComponent(form.checkOut)}%0A` +
    `Personnes%20:%20${encodeURIComponent(form.guests)}%0A` +
    `Chambre%20:%20${encodeURIComponent(form.roomType)}%0A` +
    `Message%20:%20${encodeURIComponent(form.message)}`;

  const wa = `https://wa.me/${hotel.whatsapp}?text=${waMessage}`;

  return (
    <>
      <div className="morphing-bg" aria-hidden="true">
        <div className="morphing-shape" />
        <div className="morphing-shape" />
        <div className="morphing-shape" />
      </div>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80)' }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1 className="display-text">Réservation</h1>
          <p>Remplissez le formulaire et confirmez votre réservation sur WhatsApp.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <motion.div
            className="booking-form-wrapper"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] as const }}
          >
            <form className="booking-form glass-card" onSubmit={(e) => e.preventDefault()} style={{ padding: 48, maxWidth: 700, margin: '0 auto' }}>
              <h3 style={{ marginBottom: 32, textAlign: 'center' }}>Formulaire de réservation</h3>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="name">Nom complet</label>
                  <input id="name" type="text" placeholder="Votre nom" value={form.name} onChange={(e) => update('name', e.target.value)} />
                </div>

                <div className="form-field">
                  <label htmlFor="phone">Téléphone</label>
                  <input id="phone" type="tel" placeholder="+257 XX XX XX XX" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                </div>

                <div className="form-field">
                  <label htmlFor="checkIn">Arrivée</label>
                  <input id="checkIn" type="date" value={form.checkIn} onChange={(e) => update('checkIn', e.target.value)} />
                </div>

                <div className="form-field">
                  <label htmlFor="checkOut">Départ</label>
                  <input id="checkOut" type="date" value={form.checkOut} onChange={(e) => update('checkOut', e.target.value)} />
                </div>

                <div className="form-field">
                  <label htmlFor="guests">Personnes</label>
                  <select id="guests" value={form.guests} onChange={(e) => update('guests', e.target.value)}>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} {n > 1 ? 'personnes' : 'personne'}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="roomType">Type de chambre</label>
                  <select id="roomType" value={form.roomType} onChange={(e) => update('roomType', e.target.value)}>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.name}>{r.name} — {r.price} {hotel.currency}/nuit</option>
                    ))}
                  </select>
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="message">Message (optionnel)</label>
                  <textarea id="message" rows={3} placeholder="Vos demandes particulières..." value={form.message} onChange={(e) => update('message', e.target.value)} />
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.05rem', padding: '18px 44px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Envoyer la réservation sur WhatsApp
                </a>
                <p style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--muted)' }}>
                  Vous serez redirigé vers WhatsApp pour confirmer votre réservation.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
