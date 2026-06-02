'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { rooms, hotel } from '@/data/site';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type Step = 1 | 2 | 3;

const roomImages: Record<string, string> = {
  'Chambre Standard': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80',
  'Chambre Deluxe': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80',
  'Suite Premium': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
};

export default function BookingPage() {
  const [step, setStep] = useState<Step>(1);
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

  const canProceed = (s: Step) => {
    if (s === 1) return form.fullName && form.phone;
    if (s === 2) return form.checkIn && form.checkOut && form.roomType;
    return true;
  };

  const selectedRoom = rooms.find((r) => r.name === form.roomType);

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
            {success ? (
              <motion.div
                className="glass-card"
                style={{ padding: 60, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(102,187,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 20px' }}>✅</div>
                <h2 style={{ marginBottom: 12 }}>Réservation confirmée</h2>
                <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
                  Votre réservation a été enregistrée. Vous allez être redirigé vers WhatsApp pour finaliser.
                </p>
                <div style={{ width: 40, height: 40, border: '3px solid var(--gold)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
              </motion.div>
            ) : (
              <form className="booking-form glass-card" onSubmit={handleSubmit} style={{ padding: 48, maxWidth: 800, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40, gap: 8 }}>
                  {([1, 2, 3] as Step[]).map((s) => (
                    <div key={s} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', margin: '0 auto 8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: step >= s ? 'linear-gradient(135deg, var(--gold), var(--gold-light))' : 'rgba(255,255,255,0.08)',
                        color: step >= s ? '#1b1305' : 'var(--muted)',
                        fontWeight: 700, fontSize: 14, transition: 'all 0.3s',
                      }}>{s}</div>
                      <div style={{ fontSize: 11, color: step >= s ? 'var(--gold)' : 'var(--muted)', fontWeight: step >= s ? 600 : 400, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {s === 1 ? 'Identité' : s === 2 ? 'Séjour' : 'Confirmation'}
                      </div>
                      {s < 3 && (
                        <div style={{
                          position: 'absolute', top: 18, left: 'calc(50% + 20px)', right: 'calc(-50% + 20px)',
                          height: 1, background: step > s ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                          transition: 'background 0.3s',
                        }} />
                      )}
                    </div>
                  ))}
                </div>

                {error && (
                  <div style={{ background: 'rgba(239,83,80,0.15)', color: '#ef5350', padding: '16px 20px', borderRadius: 12, marginBottom: 24, textAlign: 'center' }}>
                    {error}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                      <h3 style={{ marginBottom: 24, textAlign: 'center' }}>Qui êtes-vous ?</h3>
                      <div className="form-grid">
                        <div className="form-field">
                          <label htmlFor="fullName">Nom complet *</label>
                          <input id="fullName" type="text" placeholder="Votre nom" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required />
                        </div>
                        <div className="form-field">
                          <label htmlFor="phone">Téléphone *</label>
                          <input id="phone" type="tel" placeholder="+257 XX XX XX XX" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
                        </div>
                        <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                          <label htmlFor="email">Email</label>
                          <input id="email" type="email" placeholder="votre@email.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', marginTop: 28 }}>
                        <button type="button" className="btn btn-primary" onClick={() => setStep(2)} disabled={!canProceed(1)} style={{ fontSize: '1rem', padding: '16px 40px' }}>
                          Suivant →
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                      <h3 style={{ marginBottom: 24, textAlign: 'center' }}>Votre séjour</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
                        {rooms.map((r) => (
                          <div
                            key={r.id}
                            onClick={() => update('roomType', r.name)}
                            style={{
                              borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                              border: form.roomType === r.name ? '2px solid var(--gold)' : '2px solid rgba(255,255,255,0.08)',
                              background: form.roomType === r.name ? 'rgba(217,164,65,0.08)' : 'rgba(255,255,255,0.03)',
                              transition: 'all 0.3s',
                            }}
                          >
                            <div style={{ height: 120, backgroundImage: `url(${roomImages[r.name]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            <div style={{ padding: '12px 14px' }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{r.name}</div>
                              <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>{r.price} {hotel.currency}/nuit</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="form-grid">
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
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
                        <button type="button" className="btn btn-outline" onClick={() => setStep(1)} style={{ fontSize: '1rem', padding: '16px 32px' }}>
                          ← Retour
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => setStep(3)} disabled={!canProceed(2)} style={{ fontSize: '1rem', padding: '16px 40px' }}>
                          Suivant →
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                      <h3 style={{ marginBottom: 24, textAlign: 'center' }}>Confirmez votre réservation</h3>

                      {selectedRoom && (
                        <div className="glass-card" style={{ padding: 24, marginBottom: 24, display: 'flex', gap: 20, alignItems: 'center', cursor: 'default', background: 'rgba(255,255,255,0.03)' }}>
                          <div style={{ width: 100, height: 100, borderRadius: 12, backgroundImage: `url(${roomImages[selectedRoom.name]})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 16, color: '#fff', marginBottom: 4 }}>{selectedRoom.name}</div>
                            <div style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 14 }}>{selectedRoom.price} {hotel.currency} / nuit</div>
                            <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                              {form.checkIn && form.checkOut ? `${form.checkIn} → ${form.checkOut}` : 'Dates non spécifiées'}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="form-grid" style={{ marginBottom: 24 }}>
                        <div className="form-field">
                          <label>Nom</label>
                          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 14, color: '#fff' }}>{form.fullName}</div>
                        </div>
                        <div className="form-field">
                          <label>Téléphone</label>
                          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 14, color: '#fff' }}>{form.phone}</div>
                        </div>
                        <div className="form-field">
                          <label>Adultes</label>
                          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 14, color: '#fff' }}>{form.adults}</div>
                        </div>
                        <div className="form-field">
                          <label>Enfants</label>
                          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 14, color: '#fff' }}>{form.children}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
                        <button type="button" className="btn btn-outline" onClick={() => setStep(2)} style={{ fontSize: '1rem', padding: '16px 32px' }}>
                          ← Modifier
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '16px 44px' }} disabled={submitting}>
                          {submitting ? 'Enregistrement...' : 'Confirmer la réservation'}
                        </button>
                      </div>
                      <p style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center' }}>
                        Votre réservation sera enregistrée, puis vous serez redirigé vers WhatsApp pour confirmation.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
