'use client';

import { useEffect, useState } from 'react';
import { useAdminNotifications } from '@/components/admin/AdminNotificationProvider';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type Order = {
  id: number;
  roomNumber: string;
  items: string;
  total: number;
  status: string;
  createdAt: string;
};

type Reservation = {
  id: number;
  fullName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: string;
  createdAt: string;
};

type Message = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

const statusBadge: Record<string, { bg: string; label: string }> = {
  new: { bg: '#ffa726', label: 'Nouvelle' },
  preparing: { bg: '#42a5f5', label: 'Préparation' },
  delivered: { bg: '#66bb6a', label: 'Livrée' },
  cancelled: { bg: '#ef5350', label: 'Annulée' },
  pending: { bg: '#ffa726', label: 'En attente' },
  confirmed: { bg: '#66bb6a', label: 'Confirmée' },
  completed: { bg: '#42a5f5', label: 'Terminée' },
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomsCount, setRoomsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { notificationCount } = useAdminNotifications();

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/room-service/orders`).then((r) => r.json()),
      fetch(`${API}/api/reservations`).then((r) => r.json()),
      fetch(`${API}/api/contact`).then((r) => r.json()),
      fetch(`${API}/api/rooms`).then((r) => r.json()),
    ])
      .then(([ordersJ, resJ, msgsJ, roomsJ]) => {
        setOrders((ordersJ.data || []) as Order[]);
        setReservations((resJ.data || []) as Reservation[]);
        setMessages((msgsJ.data || []) as Message[]);
        setRoomsCount((roomsJ.data || []).length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'new').length;
  const monthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const todayReservations = reservations.filter(
    (r) => new Date(r.createdAt).toDateString() === today
  );
  const unreadMessages = messages.length;

  // Orders by day for chart (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const ordersByDay = last7.map((day) => {
    const ds = day.toDateString();
    return {
      label: day.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
      count: orders.filter((o) => new Date(o.createdAt).toDateString() === ds).length,
    };
  });
  const maxCount = Math.max(...ordersByDay.map((d) => d.count), 1);

  // Build activity feed
  const activity: { time: string; text: string; type: string }[] = [];
  for (const o of orders.slice(0, 5)) {
    activity.push({
      time: new Date(o.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      text: `Commande reçue — Chambre ${o.roomNumber}`,
      type: 'order',
    });
  }
  for (const r of reservations.slice(0, 3)) {
    activity.push({
      time: new Date(r.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      text: `Réservation créée — ${r.fullName}`,
      type: 'reservation',
    });
  }
  for (const m of messages.slice(0, 3)) {
    activity.push({
      time: new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      text: `Message reçu — ${m.name}`,
      type: 'message',
    });
  }
  activity.sort((a, b) => b.time.localeCompare(a.time));

  const formatPrice = (p: number) => p.toLocaleString() + ' FBU';

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 48 }}>Chargement...</p>;

  return (
    <div style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', margin: 0 }}>Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '4px 0 0' }}>Vue d'ensemble de l'activité NIKA HOTEL</p>
        </div>
        {notificationCount > 0 && (
          <span style={{ background: '#ef5350', color: '#fff', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700 }}>
            {notificationCount} nouvelle{notificationCount > 1 ? 's' : ''} commande{notificationCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Stats cards */}
      <div className="dash-stats">
        <div className="dash-card">
          <div className="dash-card-icon" style={{ background: 'rgba(66,165,245,0.15)', color: '#42a5f5' }}>📋</div>
          <div className="dash-card-value">{todayReservations.length}</div>
          <div className="dash-card-label">Réservations aujourd'hui</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-icon" style={{ background: 'rgba(255,167,38,0.15)', color: '#ffa726' }}>🛎️</div>
          <div className="dash-card-value">{pendingOrders}</div>
          <div className="dash-card-label">Commandes en attente</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-icon" style={{ background: 'rgba(102,187,106,0.15)', color: '#66bb6a' }}>💰</div>
          <div className="dash-card-value">{formatPrice(todayRevenue)}</div>
          <div className="dash-card-label">Revenus du jour</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-icon" style={{ background: 'rgba(171,71,188,0.15)', color: '#ab47bc' }}>🏨</div>
          <div className="dash-card-value">{roomsCount}</div>
          <div className="dash-card-label">Chambres disponibles</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-icon" style={{ background: 'rgba(239,83,80,0.15)', color: '#ef5350' }}>💬</div>
          <div className="dash-card-value">{unreadMessages}</div>
          <div className="dash-card-label">Messages non lus</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-icon" style={{ background: 'rgba(38,166,154,0.15)', color: '#26a69a' }}>📊</div>
          <div className="dash-card-value">{monthOrders.length}</div>
          <div className="dash-card-label">Commandes du mois</div>
        </div>
      </div>

      {/* Chart + Activity */}
      <div className="dash-two-col">
        {/* Chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16, fontFamily: "'Bodoni Moda', serif" }}>Commandes — 7 derniers jours</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, paddingTop: 8 }}>
            {ordersByDay.map((d) => (
              <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{d.count}</span>
                <div style={{
                  width: '100%', height: `${Math.max((d.count / maxCount) * 80, 4)}px`,
                  background: 'linear-gradient(180deg, #d9a441, #ffe2a0)',
                  borderRadius: '4px 4px 0 0', transition: 'height 0.3s',
                  minHeight: 4,
                }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16, fontFamily: "'Bodoni Moda', serif" }}>Activité récente</h3>
          {activity.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Aucune activité récente.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activity.slice(0, 8).map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', minWidth: 36, paddingTop: 2 }}>{a.time}</span>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600,
                    background: a.type === 'order' ? 'rgba(255,167,38,0.15)' : a.type === 'reservation' ? 'rgba(66,165,245,0.15)' : 'rgba(239,83,80,0.15)',
                    color: a.type === 'order' ? '#ffa726' : a.type === 'reservation' ? '#42a5f5' : '#ef5350',
                  }}>
                    {a.type === 'order' ? '🛎️' : a.type === 'reservation' ? '📋' : '💬'}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{a.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders + Recent Reservations */}
      <div className="dash-two-col">
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', margin: 0, fontFamily: "'Bodoni Moda', serif" }}>Dernières commandes</h3>
            <Link href="/admin/room-service" style={{ fontSize: 12, color: '#d9a441', textDecoration: 'none' }}>Voir tout →</Link>
          </div>
          {orders.slice(0, 5).length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Aucune commande pour le moment.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {orders.slice(0, 5).map((o) => {
                const badge = statusBadge[o.status] || { bg: '#999', label: o.status };
                return (
                  <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                    <div>
                      <span style={{ color: '#d9a441', fontWeight: 600, fontSize: 14 }}>Ch. {o.roomNumber}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginLeft: 8 }}>
                        {new Date(o.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#d9a441', fontWeight: 600, fontSize: 13 }}>{formatPrice(o.total)}</span>
                      <span style={{ background: badge.bg, color: '#fff', borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{badge.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', margin: 0, fontFamily: "'Bodoni Moda', serif" }}>Dernières réservations</h3>
            <Link href="/admin/reservations" style={{ fontSize: 12, color: '#d9a441', textDecoration: 'none' }}>Voir tout →</Link>
          </div>
          {reservations.slice(0, 5).length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Aucune réservation pour le moment.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reservations.slice(0, 5).map((r) => {
                const badge = statusBadge[r.status] || { bg: '#999', label: r.status };
                return (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                    <div>
                      <div style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{r.fullName}</div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{r.roomType}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                        {new Date(r.checkIn).toLocaleDateString('fr-FR')} - {new Date(r.checkOut).toLocaleDateString('fr-FR')}
                      </span>
                      <span style={{ background: badge.bg, color: '#fff', borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{badge.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .dash-stats {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; margin-bottom: 24px;
        }
        .dash-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 20px 16px; text-align: center;
        }
        .dash-card-icon {
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; margin: 0 auto 10px;
        }
        .dash-card-value {
          font-size: 22px; font-weight: 700; color: #fff; font-family: 'Bodoni Moda', serif;
        }
        .dash-card-label {
          font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;
        }
        .dash-two-col {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;
        }
        @media (max-width: 900px) {
          .dash-two-col { grid-template-columns: 1fr; }
          .dash-stats { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 500px) {
          .dash-stats { grid-template-columns: repeat(2, 1fr); }
          .dash-card { padding: 14px 12px; }
          .dash-card-value { font-size: 18px; }
        }
      `}</style>
    </div>
  );
}
