'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { hotel } from '@/data/site';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ContactPage() {
  const wa = `https://wa.me/${hotel.whatsapp}?text=Bonjour%20NIKA%20HOTEL,%20j%27ai%20une%20question.`;
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const waContact = `https://wa.me/${hotel.whatsapp}?text=${encodeURIComponent(
    `Bonjour NIKA HOTEL, je suis ${form.name || 'un client'}.\nSujet: ${form.subject || 'Renseignement'}\nEmail: ${form.email || 'Non renseigné'}\nMessage: ${form.message || ''}`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSent(true);
    } catch (_) {}
    setSubmitting(false);
  };

  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5!2d29.3639!3d-3.3822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8CsMjInNTUuOCJTIDI5wrAyMSc1MC4yIkU!5e0!3m2!1sfr!2sbi!4v1`;

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
          <h1 className="display-text">Contactez<br/>NIKA HOTEL</h1>
          <p>Nous sommes à votre disposition pour toute question ou réservation.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="contact-grid">
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] as const }}
            >
              <div className="glass-card" style={{ padding: 36, marginBottom: 32 }}>
                <h3 style={{ marginBottom: 24 }}>Nos coordonnées</h3>

                <div className="contact-row">
                  <strong>Adresse</strong>
                  <p>{hotel.address}<br />{hotel.location}</p>
                </div>

                <div className="contact-row">
                  <strong>Téléphone</strong>
                  <p>
                    <a href={`tel:${hotel.phone1}`} style={{ color: 'inherit' }}>{hotel.phone1}</a><br />
                    <a href={`tel:${hotel.phone2}`} style={{ color: 'inherit' }}>{hotel.phone2}</a>
                  </p>
                </div>

                <div className="contact-row">
                  <strong>WhatsApp</strong>
                  <p>
                    <a href={wa} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                      {hotel.phone1}
                    </a>
                  </p>
                </div>

                <div className="contact-row">
                  <strong>Email</strong>
                  <p>
                    <a href={`mailto:${hotel.email}`} style={{ color: 'inherit' }}>{hotel.email}</a>
                  </p>
                </div>

                <div className="contact-row" style={{ border: 'none', marginBottom: 0, paddingBottom: 0 }}>
                  <strong>Réservation</strong>
                  <p>Disponible 24h/7j via WhatsApp</p>
                </div>

                <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                  <a className="btn btn-outline" href={`tel:${hotel.phone1}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                    Appeler
                  </a>
                </div>
              </div>

              <div className="glass-card" style={{ padding: 36 }}>
                <h3 style={{ marginBottom: 24 }}>Envoyez-nous un message</h3>
                <form className="contact-form" onSubmit={handleSubmit}>
                  {sent && (
                    <div style={{ background: 'rgba(102,187,106,0.15)', color: '#66bb6a', padding: '12px 16px', borderRadius: 8, textAlign: 'center', fontSize: 14 }}>
                      Message envoyé avec succès !
                    </div>
                  )}
                  <div className="form-row">
                    <input type="text" placeholder="Votre nom" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                    <input type="email" placeholder="Votre email" value={form.email} onChange={(e) => update('email', e.target.value)} />
                  </div>
                  <input type="text" placeholder="Sujet" value={form.subject} onChange={(e) => update('subject', e.target.value)} />
                  <textarea placeholder="Votre message..." value={form.message} onChange={(e) => update('message', e.target.value)} required />
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'Envoi...' : 'Envoyer le message'}
                    </button>
                    <a className="btn btn-outline" href={waContact} target="_blank" rel="noopener noreferrer">
                      Via WhatsApp
                    </a>
                  </div>
                </form>
              </div>
            </motion.div>

            <motion.div
              className="contact-map"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.68, -0.55, 0.265, 1.55] as const }}
            >
              <div className="glass-card" style={{ padding: 36 }}>
                <h3 style={{ marginBottom: 24 }}>Nous trouver</h3>
                <div className="map-embed">
                  <iframe
                    src={mapSrc}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carte NIKA HOTEL Bujumbura"
                  />
                </div>
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>
                    <strong style={{ color: 'var(--white)' }}>{hotel.name}</strong><br />
                    {hotel.address}, {hotel.location}
                  </p>
                  <a
                    className="btn btn-outline btn-sm"
                    href="https://www.google.com/maps/dir/?api=1&destination=Kamenge+Bujumbura+Burundi"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginTop: 16 }}
                  >
                    Itinéraire
                  </a>
                </div>
              </div>
              <div className="glass-card" style={{ padding: 36, marginTop: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Horaires</h3>
                <div className="contact-row">
                  <strong>Réception</strong>
                  <p>Ouvert 24h/7 — Accueil permanent</p>
                </div>
                <div className="contact-row">
                  <strong>Restaurant</strong>
                  <p>Petit-déjeuner : 6h30 — 10h30<br/>Déjeuner : 12h — 14h30<br/>Dîner : 18h30 — 22h</p>
                </div>
                <div className="contact-row" style={{ border: 'none', marginBottom: 0, paddingBottom: 0 }}>
                  <strong>Bar & Lounge</strong>
                  <p>Tous les jours : 16h — 23h</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
