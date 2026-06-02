'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type Order = {
  id: number;
  roomNumber: string;
  items: string;
  total: number;
  message: string | null;
  status: string;
  createdAt: string;
};

const statusColors: Record<string, string> = {
  new: '#ffa726',
  preparing: '#42a5f5',
  delivered: '#66bb6a',
  cancelled: '#ef5350',
};

const statusLabels: Record<string, string> = {
  new: 'Nouvelle',
  preparing: 'Préparation',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const columns = ['new', 'preparing', 'delivered', 'cancelled'];

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // ignore silencieusement
  }
}

export default function AdminRoomService() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [lastToast, setLastToast] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const seenIds = useRef(new Set<number>());
  const prevJson = useRef('');
  const firstLoad = useRef(true);

  const fetchOrders = useCallback(() => {
    fetch(`${API}/api/room-service/orders`)
      .then((r) => r.json())
      .then((j) => {
        const data = (j.data || []) as Order[];
        const json = JSON.stringify(data);
        if (json === prevJson.current) return;
        prevJson.current = json;

        if (firstLoad.current) {
          firstLoad.current = false;
          for (const o of data) seenIds.current.add(o.id);
          setOrders(data);
          setLoading(false);
          return;
        }

        const newOrders = data.filter((o) => o.status === 'new' && !seenIds.current.has(o.id));
        for (const o of data) seenIds.current.add(o.id);

        if (newOrders.length > 0) {
          setNotificationCount((c) => c + newOrders.length);
          setLastToast(`Nouvelle commande Chambre ${newOrders[0].roomNumber}`);
          if (audioEnabled) playNotificationSound();
          try { navigator.vibrate?.([200, 100, 200]); } catch {}
          setTimeout(() => setLastToast(null), 4000);
        }

        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [audioEnabled]);

  useEffect(() => {
    fetchOrders();
    const iv = setInterval(fetchOrders, 6000);
    return () => clearInterval(iv);
  }, [fetchOrders]);

  const updateStatus = async (id: number, status: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    try {
      await fetch(`${API}/api/room-service/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch {
      fetchOrders();
    }
  };

  const getOrdersByStatus = (status: string) => orders.filter((o) => o.status === status);
  const formatPrice = (p: number) => p.toLocaleString() + ' FBU';
  const parseItems = (items: string) => { try { return JSON.parse(items); } catch { return []; } };

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 48 }}>Chargement...</p>;

  return (
    <div style={{ position: 'relative', maxWidth: '100vw', overflowX: 'hidden' }}>
      {lastToast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: 'linear-gradient(135deg, #d9a441, #ffe2a0)', color: '#1b1305',
          padding: '14px 24px', borderRadius: 12, fontWeight: 600, fontSize: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease-out',
        }}>
          {lastToast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', marginBottom: 4 }}>Room Service</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>Commandes des chambres</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {notificationCount > 0 && (
            <span style={{
              background: '#ef5350', color: '#fff', borderRadius: 50, padding: '4px 12px',
              fontSize: 12, fontWeight: 700,
            }}>
              {notificationCount} nouvelle{notificationCount > 1 ? 's' : ''}
            </span>
          )}
          <button
            onClick={() => { setAudioEnabled(true); setNotificationCount(0); }}
            className="btn btn-sm"
            style={{
              background: audioEnabled ? 'rgba(102,187,106,0.2)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${audioEnabled ? '#66bb6a' : 'rgba(255,255,255,0.15)'}`,
              color: audioEnabled ? '#66bb6a' : '#fff',
            }}
          >
            {audioEnabled ? 'Notifications activées' : 'Activer les notifications'}
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 48 }}>Aucune commande pour le moment.</p>
      ) : (
        <div className="rs-grid">
          {columns.map((col) => (
            <div key={col}>
              <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: statusColors[col], marginBottom: 12, fontWeight: 600 }}>
                {statusLabels[col]} ({getOrdersByStatus(col).length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {getOrdersByStatus(col).map((order) => {
                  const items = parseItems(order.items);
                  return (
                    <div key={order.id} className="glass-card" style={{ padding: 16, fontSize: 13 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <strong style={{ color: '#d9a441', fontSize: 15 }}>Ch. {order.roomNumber}</strong>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                        {items.map((item: any, idx: number) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.6)' }}>
                            <span>{item.name} x{item.quantity}</span>
                            <span style={{ color: '#d9a441' }}>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ color: '#fff' }}>Total</strong>
                        <strong style={{ color: '#d9a441' }}>{formatPrice(order.total)}</strong>
                      </div>
                      {order.message && (
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 8px', fontStyle: 'italic' }}>
                          &ldquo;{order.message}&rdquo;
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {order.status === 'new' && (
                          <>
                            <button className="btn btn-sm" style={{ background: '#42a5f5', color: '#fff', border: 'none' }} onClick={() => updateStatus(order.id, 'preparing')}>
                              Accepter
                            </button>
                            <button className="btn btn-sm" style={{ background: '#ef5350', color: '#fff', border: 'none' }} onClick={() => updateStatus(order.id, 'cancelled')}>
                              Annuler
                            </button>
                          </>
                        )}
                        {order.status === 'preparing' && (
                          <button className="btn btn-sm" style={{ background: '#66bb6a', color: '#fff', border: 'none' }} onClick={() => updateStatus(order.id, 'delivered')}>
                            Livrer
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .rs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .rs-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .rs-grid { grid-template-columns: 1fr; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
