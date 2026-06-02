'use client';

import { useEffect, useState } from 'react';

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

export default function AdminRoomService() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${API}/api/room-service/orders`)
      .then((r) => r.json())
      .then((j) => { setOrders(j.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); const iv = setInterval(fetchOrders, 5000); return () => clearInterval(iv); }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API}/api/room-service/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const getOrdersByStatus = (status: string) => orders.filter((o) => o.status === status);

  const formatPrice = (p: number) => p.toLocaleString() + ' FBU';

  const parseItems = (items: string) => {
    try { return JSON.parse(items); } catch { return []; }
  };

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 48 }}>Chargement...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', marginBottom: 8 }}>Room Service</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24, fontSize: 14 }}>Commandes des chambres</p>

      {orders.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 48 }}>Aucune commande pour le moment.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
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
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
