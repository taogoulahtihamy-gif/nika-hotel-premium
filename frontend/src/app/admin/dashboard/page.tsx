'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/reservations/stats`)
      .then((r) => r.json())
      .then((j) => { setStats(j.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 48 }}>Chargement...</p>;

  if (!stats) return <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 48 }}>Aucune donnée pour le moment.</p>;

  const cards = [
    { label: 'Total Réservations', value: stats.total, color: '#d9a441' },
    { label: 'En attente', value: stats.pending, color: '#ffa726' },
    { label: 'Confirmées', value: stats.confirmed, color: '#66bb6a' },
    { label: 'Annulées', value: stats.cancelled, color: '#ef5350' },
    { label: 'Terminées', value: stats.completed, color: '#42a5f5' },
    { label: 'Aujourd\'hui', value: stats.todayReservations, color: '#ab47bc' },
    { label: 'Ce mois', value: stats.monthReservations, color: '#26a69a' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "'Bodoni Moda', serif", color: '#fff' }}>Dashboard</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 14 }}>Vue d'ensemble de l'activité</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map((c) => (
          <div key={c.label} className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {stats.rooms && stats.rooms.length > 0 ? (
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#fff', fontFamily: "'Bodoni Moda', serif" }}>Chambres les plus demandées</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.rooms.map((r: any) => (
              <div key={r.roomType} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{r.roomType}</span>
                <span style={{ color: '#d9a441', fontWeight: 600 }}>{r._count.roomType} réservation(s)</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
