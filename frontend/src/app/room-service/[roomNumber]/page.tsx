'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

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

export default function RoomServicePage() {
  const { roomNumber } = useParams<{ roomNumber: string }>();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/api/room-service/menu`)
      .then((r) => r.json())
      .then((j) => setMenu(j.data || []))
      .catch(() => {});
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQty = (name: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.name === name ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (name: string) => {
    setCart((prev) => prev.filter((i) => i.name !== name));
  };

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

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = menu.filter((i) => i.category === activeCategory);

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#06152f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', marginBottom: 12 }}>
            Commande envoyée avec succès
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24, lineHeight: 1.6 }}>
            Votre commande pour la Chambre {roomNumber} a été reçue. Elle est en cours de traitement.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => { setSuccess(false); setCart([]); setMessage(''); }}
          >
            Nouvelle commande
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06152f', display: 'flex', flexDirection: 'column', paddingBottom: 120 }}>
      <div style={{ background: 'linear-gradient(135deg, #0a3c78, #06152f)', padding: '48px 20px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#d9a441', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>NIKA HOTEL</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', margin: 0 }}>
          Chambre {roomNumber}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '8px 0 0' }}>
          Commandez depuis votre chambre
        </p>
      </div>

      {error && (
        <div style={{ margin: '12px 16px', background: 'rgba(239,83,80,0.15)', color: '#ef5350', padding: '12px 16px', borderRadius: 10, fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ overflowX: 'auto', padding: '12px 16px', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '10px 18px', borderRadius: 50, border: 'none',
                background: activeCategory === cat.id
                  ? 'linear-gradient(135deg, #d9a441, #ffe2a0)'
                  : 'rgba(255,255,255,0.08)',
                color: activeCategory === cat.id ? '#1b1305' : 'rgba(255,255,255,0.7)',
                fontWeight: activeCategory === cat.id ? 600 : 400,
                fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: "'Jost', sans-serif", transition: 'all 0.2s',
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredItems.map((item) => {
          const inCart = cart.find((i) => i.name === item.name);
          return (
            <div
              key={item.name}
              style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: 14,
                padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <div>
                <div style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>{item.name}</div>
                <div style={{ color: '#d9a441', fontSize: 13, fontWeight: 600, marginTop: 2 }}>
                  {item.price === 0 ? 'Gratuit' : formatPrice(item.price)}
                </div>
              </div>
              <div>
                {inCart ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      onClick={() => updateQty(item.name, -1)}
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 16,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >−</button>
                    <span style={{ color: '#fff', fontSize: 15, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
                      {inCart.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: 'none',
                        background: 'linear-gradient(135deg, #d9a441, #ffe2a0)', color: '#1b1305', fontSize: 16,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                      }}
                    >+</button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item)}
                    style={{
                      padding: '8px 18px', borderRadius: 50, border: 'none',
                      background: 'linear-gradient(135deg, #d9a441, #ffe2a0)',
                      color: '#1b1305', fontWeight: 600, fontSize: 13,
                      cursor: 'pointer', fontFamily: "'Jost', sans-serif",
                    }}
                  >
                    + Ajouter
                  </button>
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
          padding: '16px', zIndex: 100,
          boxShadow: '0 -8px 32px rgba(0,0,0,0.3)',
        }}>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <details style={{ marginBottom: 10 }}>
              <summary style={{ color: '#d9a441', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                Voir le panier ({cart.length} article{cart.length > 1 ? 's' : ''})
              </summary>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cart.map((i) => (
                  <div key={i.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                    <span>{i.name} x{i.quantity}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#d9a441' }}>{formatPrice(i.price * i.quantity)}</span>
                      <button onClick={() => removeItem(i.name)} style={{ background: 'none', border: 'none', color: '#ef5350', cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            </details>
            <textarea
              placeholder="Message optionnel..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontFamily: "'Jost', sans-serif", fontSize: 14,
                outline: 'none', resize: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Total</span>
              <span style={{ color: '#d9a441', fontSize: 20, fontWeight: 700, fontFamily: "'Bodoni Moda', serif" }}>{formatPrice(total)}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: '100%', padding: '16px', borderRadius: 14, border: 'none',
                background: submitting ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #d9a441, #ffe2a0)',
                color: submitting ? 'rgba(255,255,255,0.5)' : '#1b1305',
                fontWeight: 700, fontSize: 16,
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily: "'Jost', sans-serif",
              }}
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer la commande'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
