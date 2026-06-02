'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useAdminNotifications } from '@/components/admin/AdminNotificationProvider';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type Order = {
  id: number;
  orderNumber: string;
  roomNumber: string;
  items: string;
  total: number;
  message: string | null;
  status: string;
  createdAt: string;
};

const statusColors: Record<string, string> = {
  received: '#ffa726',
  preparing: '#42a5f5',
  delivery: '#ab47bc',
  delivered: '#66bb6a',
};

const statusLabels: Record<string, string> = {
  received: 'Reçue',
  preparing: 'Préparation',
  delivery: 'Livraison',
  delivered: 'Livrée',
};

const columns = ['received', 'preparing', 'delivery', 'delivered'];

export default function AdminRoomService() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { resetCount } = useAdminNotifications();
  const prevJson = useRef('');

  const fetchOrders = useCallback(() => {
    fetch(`${API}/api/room-service/orders`)
      .then((r) => r.json())
      .then((j) => {
        const data = (j.data || []) as Order[];
        const json = JSON.stringify(data);
        if (json === prevJson.current) return;
        prevJson.current = json;
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchOrders(); resetCount(); }, [fetchOrders, resetCount]);

  useEffect(() => {
    const iv = setInterval(fetchOrders, 5000);
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
    } catch { fetchOrders(); }
  };

  const getOrdersByStatus = (status: string) => orders.filter((o) => o.status === status);
  const formatPrice = (p: number) => p.toLocaleString() + ' FBU';
  const parseItems = (items: string) => { try { return JSON.parse(items); } catch { return []; } };

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 48 }}>Chargement...</p>;

  return (
    <div style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', marginBottom: 4 }}>Room Service</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24, fontSize: 14 }}>Commandes des chambres</p>

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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <strong style={{ color: '#d9a441', fontSize: 15 }}>Ch. {order.roomNumber}</strong>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginBottom: 8 }}>
                        {order.orderNumber}
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
                      <div className="rs-actions">
                        {order.status === 'received' && (
                          <>
                            <button className="rs-btn rs-btn-accept" onClick={() => updateStatus(order.id, 'preparing')}>Accepter</button>
                          </>
                        )}
                        {order.status === 'preparing' && (
                          <button className="rs-btn rs-btn-delivery" onClick={() => updateStatus(order.id, 'delivery')}>En livraison</button>
                        )}
                        {order.status === 'delivery' && (
                          <button className="rs-btn rs-btn-deliver" onClick={() => updateStatus(order.id, 'delivered')}>Livrer</button>
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
        .rs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .rs-actions { display: flex; gap: 6px; flex-wrap: wrap; }
        .rs-btn {
          height: 32px; padding: 0 14px; border-radius: 999px; font-size: 12px; font-weight: 600;
          border: none; cursor: pointer; font-family: 'Jost', sans-serif;
          display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s;
        }
        .rs-btn-accept { background: #ffa726; color: #fff; }
        .rs-btn-accept:hover { background: #f57c00; }
        .rs-btn-delivery { background: #ab47bc; color: #fff; }
        .rs-btn-delivery:hover { background: #8e24aa; }
        .rs-btn-deliver { background: #66bb6a; color: #fff; }
        .rs-btn-deliver:hover { background: #43a047; }
        @media (max-width: 1024px) { .rs-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .rs-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
