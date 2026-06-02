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

  useEffect(() => {
    fetch(`${API}/api/room-service/menu`)
      .then((r) => r.json())
      .then((j) => setMenu(j.data || []))
      .catch(() => {});
  }, []);

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
      <div style={{ minHeight: '100vh', background: '#06152f', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #d9a441, #ffe2a0)', color: '#1b1305', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, fontFamily: "'Jost', sans-serif", marginBottom: 24, boxShadow: '0 12px 40px rgba(217,164,65,0.2)' }}>NH</div>
          <div style={{ fontSize: 12, color: '#d9a441', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 8 }}>NIKA HOTEL</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', marginBottom: 4 }}>Chambre {roomNumber}</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32, maxWidth: 280 }}>
            Bienvenue dans votre espace Room Service
          </p>
          <button onClick={() => setView('menu')} style={{ width: '100%', maxWidth: 320, padding: '18px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #d9a441, #ffe2a0)', color: '#1b1305', fontWeight: 700, fontSize: 17, cursor: 'pointer', fontFamily: "'Jost', sans-serif", marginBottom: 12 }}>
            Commander maintenant
          </button>
          <a className="btn btn-outline" href={`tel:${hotel.phone1}`} style={{ width: '100%', maxWidth: 320, justifyContent: 'center', padding: '14px' }}>
            Appeler la réception
          </a>
        </div>
        <div style={{ padding: '0 24px 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {quickCards.map((c) => (
            <button key={c.id} onClick={() => { setActiveCategory(c.id); setView('menu'); }} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 8px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{c.emoji}</div>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>{c.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{c.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ───── SUCCESS SCREEN ───── */
  if (view === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: '#06152f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(102,187,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: 20 }}>✅</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', marginBottom: 8 }}>Commande envoyée</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32, maxWidth: 300 }}>
          Votre commande a été transmise à la réception. Elle sera traitée dans les plus brefs délais.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          <button onClick={() => { setView('menu'); setCart([]); setMessage(''); }} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
            Nouvelle commande
          </button>
          <a className="btn btn-outline" href={`tel:${hotel.phone1}`} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
            Appeler la réception
          </a>
        </div>
      </div>
    );
  }

  /* ───── MENU SCREEN ───── */
  return (
    <div style={{ minHeight: '100vh', background: '#06152f', display: 'flex', flexDirection: 'column', paddingBottom: 140, overflowX: 'hidden' }}>
      <div style={{ background: 'linear-gradient(135deg, #0a3c78, #06152f)', padding: '48px 20px 20px', textAlign: 'center', position: 'relative' }}>
        <button onClick={() => setView('welcome')} style={{ position: 'absolute', left: 16, top: 48, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 10, padding: '8px 12px', fontSize: 13, cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}>
          ← Retour
        </button>
        <div style={{ fontSize: 11, color: '#d9a441', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 4 }}>NIKA HOTEL</div>
        <h1 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', margin: 0 }}>Chambre {roomNumber}</h1>
      </div>

      {error && (
        <div style={{ margin: '12px 16px', background: 'rgba(239,83,80,0.15)', color: '#ef5350', padding: '12px 16px', borderRadius: 10, fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ overflowX: 'auto', padding: '12px 16px', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
              padding: '10px 18px', borderRadius: 50, border: 'none', whiteSpace: 'nowrap',
              background: activeCategory === cat.id ? 'linear-gradient(135deg, #d9a441, #ffe2a0)' : 'rgba(255,255,255,0.08)',
              color: activeCategory === cat.id ? '#1b1305' : 'rgba(255,255,255,0.7)',
              fontWeight: activeCategory === cat.id ? 600 : 400,
              fontSize: 14, cursor: 'pointer', fontFamily: "'Jost', sans-serif", transition: 'all 0.2s',
            }}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredItems.map((item) => {
          const inCart = cart.find((i) => i.name === item.name);
          return (
            <div key={item.name} style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '14px 16px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#fff', fontSize: 15, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
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
                    padding: '8px 18px', borderRadius: 50, border: 'none',
                    background: 'linear-gradient(135deg, #d9a441, #ffe2a0)',
                    color: '#1b1305', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: "'Jost', sans-serif",
                  }}>+ Ajouter</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'rgba(6,21,47,0.98)', backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '16px', zIndex: 100, boxShadow: '0 -8px 32px rgba(0,0,0,0.3)',
          maxHeight: '50vh', overflowY: 'auto',
        }}>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <details style={{ marginBottom: 10 }}>
              <summary style={{ color: '#d9a441', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                Voir le panier ({cart.length} article{cart.length > 1 ? 's' : ''}) — {formatPrice(total)}
              </summary>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cart.map((i) => (
                  <div key={i.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{i.name} x{i.quantity}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ color: '#d9a441' }}>{formatPrice(i.price * i.quantity)}</span>
                      <button onClick={() => removeItem(i.name)} style={{ background: 'none', border: 'none', color: '#ef5350', cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            </details>
            <textarea placeholder="Message optionnel..." value={message} onChange={(e) => setMessage(e.target.value)} rows={2} style={{
              width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', fontFamily: "'Jost', sans-serif", fontSize: 14,
              outline: 'none', resize: 'none', boxSizing: 'border-box',
            }} />
            <button onClick={handleSubmit} disabled={submitting} style={{
              width: '100%', padding: '16px', borderRadius: 14, border: 'none',
              background: submitting ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #d9a441, #ffe2a0)',
              color: submitting ? 'rgba(255,255,255,0.5)' : '#1b1305',
              fontWeight: 700, fontSize: 16, cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: "'Jost', sans-serif",
            }}>
              {submitting ? 'Envoi en cours...' : `Commander — ${formatPrice(total)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
