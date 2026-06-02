'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { rooms, hotel } from '@/data/site';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function BookingPage() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    checkIn: '',
    checkOut: '',
    adults: '2',
    children: '0',
    roomType: rooms[1]?.name || 'Chambre Deluxe',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    const waText = `Bonjour%20NIKA%20HOTEL,%0A` +
      `Je%20souhaite%20reserver%20une%20chambre.%0A` +
      `Nom%20:%20${encodeURIComponent(form.fullName)}%0A` +
      `Tel%20:%20${encodeURIComponent(form.phone)}%0A` +
      `${form.email ? `Email%20:%20${encodeURIComponent(form.email)}%0A` : ''}` +
      `Arrivee%20:%20${encodeURIComponent(form.checkIn)}%0A` +
      `Depart%20:%20${encodeURIComponent(form.checkOut)}%0A` +
      `Adultes%20:%20${encodeURIComponent(form.adults)}%0A` +
      `Enfants%20:%20${encodeURIComponent(form.children)}%0A` +
      `Chambre%20:%20${encodeURIComponent(form.roomType)}%0A` +
      `${form.message ? `Message%20:%20${encodeURIComponent(form.message)}` : ''}`;

    try {
      const res = await fetch(`${API}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email || undefined,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          adults: parseInt(form.adults),
          children: parseInt(form.children),
          roomType: form.roomType,
          message: form.message || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Erreur lors de la réservation');

      setSuccess(true);
      setSubmitting(false);

      setTimeout(() => {
        window.open(`https://wa.me/${hotel.whatsapp}?text=${waText}`, '_blank');
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la réservation');
      setSubmitting(false);
    }
  };

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
          <p>Remplissez le formulaire pour réserver votre chambre.</p>
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
            <form className="booking-form glass-card" onSubmit={handleSubmit} style={{ padding: 48, maxWidth: 700, margin: '0 auto' }}>
              <h3 style={{ marginBottom: 32, textAlign: 'center' }}>Formulaire de réservation</h3>

              {success && (
                <div style={{ background: 'rgba(102,187,106,0.15)', color: '#66bb6a', padding: '16px 20px', borderRadius: 12, marginBottom: 24, textAlign: 'center' }}>
                  Réservation enregistrée ! Vous allez être redirigé vers WhatsApp pour confirmer.
                </div>
              )}

              {error && (
                <div style={{ background: 'rgba(239,83,80,0.15)', color: '#ef5350', padding: '16px 20px', borderRadius: 12, marginBottom: 24, textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="fullName">Nom complet *</label>
                  <input id="fullName" type="text" placeholder="Votre nom" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required />
                </div>

                <div className="form-field">
                  <label htmlFor="phone">Téléphone *</label>
                  <input id="phone" type="tel" placeholder="+257 XX XX XX XX" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" placeholder="votre@email.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
                </div>

                <div className="form-field">
                  <label htmlFor="roomType">Type de chambre *</label>
                  <select id="roomType" value={form.roomType} onChange={(e) => update('roomType', e.target.value)} required>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.name}>{r.name} — {r.price} {hotel.currency}/nuit</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="checkIn">Arrivée *</label>
                  <input id="checkIn" type="date" value={form.checkIn} onChange={(e) => update('checkIn', e.target.value)} required />
                </div>

                <div className="form-field">
                  <label htmlFor="checkOut">Départ *</label>
                  <input id="checkOut" type="date" value={form.checkOut} onChange={(e) => update('checkOut', e.target.value)} required />
                </div>

                <div className="form-field">
                  <label htmlFor="adults">Adultes *</label>
                  <select id="adults" value={form.adults} onChange={(e) => update('adults', e.target.value)} required>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="children">Enfants</label>
                  <select id="children" value={form.children} onChange={(e) => update('children', e.target.value)}>
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="message">Message (optionnel)</label>
                  <textarea id="message" rows={3} placeholder="Vos demandes particulières..." value={form.message} onChange={(e) => update('message', e.target.value)} />
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <button type="submit" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '18px 44px' }} disabled={submitting}>
                  {submitting ? 'Enregistrement...' : 'Réserver maintenant'}
                </button>
                <p style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--muted)' }}>
                  Votre réservation sera enregistrée, puis vous serez redirigé vers WhatsApp pour confirmation.
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
