'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { hotel } from '@/data/site';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type MenuItem = {
  name: string;
  price: number;
  category: string;
};

type CartItem = {
  name: string;
  price: number;
  quantity: number;
  category: string;
};

const categories = [
  { id: 'Petit-déjeuner', label: 'Petit-déjeuner', emoji: '🥐' },
  { id: 'Restaurant', label: 'Restaurant', emoji: '🍽️' },
  { id: 'Bar', label: 'Bar', emoji: '🍸' },
  { id: 'Boissons', label: 'Boissons', emoji: '🥤' },
  { id: 'Service Chambre', label: 'Service chambre', emoji: '🛎️' },
  { id: 'Réception', label: 'Réception', emoji: '📞' },
];

const quickCards = [
  { id: 'Petit-déjeuner', label: 'Petit-déjeuner', emoji: '🥐', desc: 'Dès le matin' },
  { id: 'Restaurant', label: 'Restaurant', emoji: '🍽️', desc: 'Plats cuisinés' },
  { id: 'Bar', label: 'Bar', emoji: '🍸', desc: 'Cocktails & vins' },
  { id: 'Boissons', label: 'Boissons', emoji: '🥤', desc: 'Fraîches & chaudes' },
  { id: 'Service Chambre', label: 'Service chambre', emoji: '🛎️', desc: 'Demandes' },
  { id: 'Réception', label: 'Réception', emoji: '📞', desc: 'Assistance' },
];

export default function RoomServicePage() {
  const { roomNumber } = useParams<{ roomNumber: string }>();
  const [view, setView] = useState<'welcome' | 'menu' | 'success'>('welcome');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API}/api/room-service/menu`)
      .then((r) => r.json())
      .then((j) => setMenu(j.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (cart.length > 0 && cartRef.current) {
      cartRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [cart.length]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) return prev.map((i) => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const updateQty = useCallback((name: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.name === name ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((name: string) => {
    setCart((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const formatPrice = (p: number) => p.toLocaleString() + ' FBU';

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/room-service/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumber,
          items: JSON.stringify(cart),
          total,
          message: message || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Erreur');
      setView('success');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = menu.filter((i) => i.category === activeCategory);

  /* ───── WELCOME SCREEN ───── */
  if (view === 'welcome') {
    return (
      <div style={{ minHeight: '100dvh', background: '#06152f', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', width: '80vw', height: '80vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,86,160,0.2), transparent 70%)',
            top: '-20%', right: '-20%', animation: 'morphFloat 20s ease-in-out infinite alternate',
          }} />
          <div style={{
            position: 'absolute', width: '70vw', height: '70vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217,164,65,0.1), transparent 70%)',
            bottom: '-10%', left: '-20%', animation: 'morphFloat 25s ease-in-out infinite alternate reverse',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(217,164,65,0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 30%, rgba(26,86,160,0.05) 0%, transparent 50%)`,
          }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 24px', textAlign: 'center' }}>
          <div className="rs-logo">NH</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(102,187,106,0.12)', border: '1px solid rgba(102,187,106,0.2)', borderRadius: 999, padding: '6px 14px 6px 10px', marginBottom: 16, color: '#66bb6a', fontSize: 12, fontWeight: 600, letterSpacing: '0.03em' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#66bb6a', display: 'inline-block', boxShadow: '0 0 8px rgba(102,187,106,0.5)' }} />
            Disponible 24h/7
          </div>
          <div style={{ fontSize: 11, color: '#d9a441', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 6, fontWeight: 500 }}>NIKA HOTEL</div>
          <h1 style={{ fontSize: 30, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Bienvenue<br />Chambre {roomNumber}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 8, maxWidth: 300, lineHeight: 1.6 }}>
            Commandez depuis votre chambre — petit-déjeuner, plats, boissons et services hôteliers livrés en un instant.
          </p>
          <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 320, marginBottom: 8 }}>
            <button onClick={() => setView('menu')} style={{ flex: 1, height: 48, borderRadius: 999, border: 'none', background: 'linear-gradient(135deg, #d9a441, #ffe2a0)', color: '#1b1305', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'Jost', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Voir le menu
            </button>
          </div>
          <a href={`tel:${hotel.phone1}`} style={{ width: '100%', maxWidth: 320, height: 42, borderRadius: 999, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: "'Jost', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            Appeler la réception
          </a>
        </div>
        <div style={{ position: 'relative', zIndex: 1, padding: '0 20px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 400, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {quickCards.map((c) => (
            <button key={c.id} onClick={() => { setActiveCategory(c.id); setView('menu'); }} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
              padding: '16px 6px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontSize: 26, lineHeight: 1 }}>{c.emoji}</div>
              <div style={{ color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: '0.02em' }}>{c.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>{c.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ───── SUCCESS SCREEN ───── */
  if (view === 'success') {
    return (
      <div style={{ minHeight: '100dvh', background: '#06152f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: -20, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102,187,106,0.15), transparent 70%)',
          }} />
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(102,187,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: 20, position: 'relative' }}>✅</div>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', marginBottom: 8 }}>Commande envoyée</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32, maxWidth: 300, lineHeight: 1.6 }}>
          Votre commande a été transmise à la réception. Elle sera traitée dans les plus brefs délais.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          <button onClick={() => { setView('menu'); setCart([]); setMessage(''); }} style={{ width: '100%', height: 48, borderRadius: 999, border: 'none', background: 'linear-gradient(135deg, #d9a441, #ffe2a0)', color: '#1b1305', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: "'Jost', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            Nouvelle commande
          </button>
          <a href={`tel:${hotel.phone1}`} style={{ width: '100%', height: 44, borderRadius: 999, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontWeight: 500, fontSize: 14, cursor: 'pointer', fontFamily: "'Jost', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            Appeler la réception
          </a>
        </div>
      </div>
    );
  }

  /* ───── MENU SCREEN ───── */
  return (
    <div style={{ minHeight: '100dvh', background: '#06152f', display: 'flex', flexDirection: 'column', overflowX: 'hidden', position: 'relative' }}>
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0a3c78 0%, #06152f 100%)',
        padding: '52px 20px 20px',
        textAlign: 'center',
      }}>
        <button onClick={() => setView('welcome')} style={{
          position: 'absolute', left: 12, top: 48,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          color: '#fff', borderRadius: 999, height: 34, padding: '0 14px', fontSize: 12,
          cursor: 'pointer', fontFamily: "'Jost', sans-serif", display: 'flex', alignItems: 'center', gap: 4,
        }}>
          ← Retour
        </button>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', width: '60vw', height: '60vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217,164,65,0.06), transparent 70%)',
            top: '-40%', right: '-10%',
          }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 10, color: '#d9a441', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 2, fontWeight: 500 }}>NIKA HOTEL</div>
          <h1 style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', margin: '0 0 2px' }}>Chambre {roomNumber}</h1>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>Service en chambre</div>
        </div>
      </div>

      {error && (
        <div style={{ margin: '12px 16px 0', background: 'rgba(239,83,80,0.15)', color: '#ef5350', padding: '12px 16px', borderRadius: 10, fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#06152f', paddingTop: 4 }}>
        <div style={{ overflowX: 'auto', padding: '10px 16px 8px', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                padding: '9px 18px', borderRadius: 50, border: 'none', whiteSpace: 'nowrap',
                background: activeCategory === cat.id ? 'linear-gradient(135deg, #d9a441, #ffe2a0)' : 'rgba(255,255,255,0.08)',
                color: activeCategory === cat.id ? '#1b1305' : 'rgba(255,255,255,0.7)',
                fontWeight: activeCategory === cat.id ? 600 : 400,
                fontSize: 13, cursor: 'pointer', fontFamily: "'Jost', sans-serif", transition: 'all 0.2s',
              }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '4px 16px 20px', display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 600, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            Aucun élément dans cette catégorie
          </div>
        )}
        {filteredItems.map((item) => {
          const inCart = cart.find((i) => i.name === item.name);
          return (
            <div key={item.name} style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '14px 16px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#fff', fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                <div style={{ color: '#d9a441', fontSize: 13, fontWeight: 600, marginTop: 2 }}>
                  {item.price === 0 ? 'Gratuit' : formatPrice(item.price)}
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                {inCart ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => updateQty(item.name, -1)} style={{
                      width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 16,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>−</button>
                    <span style={{ color: '#fff', fontSize: 15, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{inCart.quantity}</span>
                    <button onClick={() => addToCart(item)} style={{
                      width: 32, height: 32, borderRadius: 8, border: 'none',
                      background: 'linear-gradient(135deg, #d9a441, #ffe2a0)', color: '#1b1305', fontSize: 16,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                    }}>+</button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(item)} style={{
                    height: 36, padding: '0 18px', borderRadius: 999, border: 'none',
                    background: 'linear-gradient(135deg, #d9a441, #ffe2a0)',
                    color: '#1b1305', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: "'Jost', sans-serif",
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>+ Ajouter</button>
                )}
              </div>
            </div>
          );
        })}
        <div style={{ height: cart.length > 0 ? 180 : 40, flexShrink: 0 }} />
      </div>

      {cart.length > 0 && (
        <div ref={cartRef} style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'rgba(6,21,47,0.98)', backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '14px 16px', zIndex: 100, boxShadow: '0 -8px 32px rgba(0,0,0,0.3)',
          maxHeight: '45vh', overflowY: 'auto',
        }}>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <details style={{ marginBottom: 8 }}>
              <summary style={{ color: '#d9a441', fontSize: 13, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                🛒 Voir le panier ({cart.length} article{cart.length > 1 ? 's' : ''}) — {formatPrice(total)}
              </summary>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cart.map((i) => (
                  <div key={i.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{i.name} x{i.quantity}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ color: '#d9a441' }}>{formatPrice(i.price * i.quantity)}</span>
                      <button onClick={() => removeItem(i.name)} style={{ background: 'none', border: 'none', color: '#ef5350', cursor: 'pointer', fontSize: 18, padding: '0 2px', lineHeight: 1 }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            </details>
            <textarea placeholder="Message optionnel (allergies, préférences...)" value={message} onChange={(e) => setMessage(e.target.value)} rows={2} style={{
              width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 8,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', fontFamily: "'Jost', sans-serif", fontSize: 13,
              outline: 'none', resize: 'none', boxSizing: 'border-box',
            }} />
            <button onClick={handleSubmit} disabled={submitting} style={{
              width: '100%', height: 48, borderRadius: 999, border: 'none',
              background: submitting ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #d9a441, #ffe2a0)',
              color: submitting ? 'rgba(255,255,255,0.5)' : '#1b1305',
              fontWeight: 700, fontSize: 15, cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: "'Jost', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {submitting ? 'Envoi en cours...' : `Commander — ${formatPrice(total)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
