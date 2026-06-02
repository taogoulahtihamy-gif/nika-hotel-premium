'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type Reservation = {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomType: string;
  message: string | null;
  status: string;
  createdAt: string;
};

const statusColors: Record<string, string> = {
  pending: '#ffa726',
  confirmed: '#66bb6a',
  cancelled: '#ef5350',
  completed: '#42a5f5',
};

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = () => {
    setLoading(true);
    fetch(`${API}/api/reservations`)
      .then((r) => r.json())
      .then((j) => { setReservations(j.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchReservations(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API}/api/reservations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchReservations();
  };

  const deleteReservation = async (id: number) => {
    if (!confirm('Supprimer cette réservation ?')) return;
    await fetch(`${API}/api/reservations/${id}`, { method: 'DELETE' });
    fetchReservations();
  };

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)' }}>Chargement...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "'Bodoni Moda', serif", color: '#fff' }}>Réservations</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 14 }}>Gérer les réservations des clients</p>

      {reservations.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 48 }}>Aucune réservation pour le moment.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reservations.map((r) => (
            <div key={r.id} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <strong style={{ fontSize: 16, color: '#fff' }}>{r.fullName}</strong>
                    <span style={{
                      padding: '3px 12px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                      background: `${statusColors[r.status]}22`, color: statusColors[r.status],
                      textTransform: 'uppercase', letterSpacing: 1,
                    }}>{r.status}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                    <div><strong style={{ color: '#d9a441' }}>Tél:</strong> {r.phone}</div>
                    {r.email && <div><strong style={{ color: '#d9a441' }}>Email:</strong> {r.email}</div>}
                    <div><strong style={{ color: '#d9a441' }}>Arrivée:</strong> {new Date(r.checkIn).toLocaleDateString()}</div>
                    <div><strong style={{ color: '#d9a441' }}>Départ:</strong> {new Date(r.checkOut).toLocaleDateString()}</div>
                    <div><strong style={{ color: '#d9a441' }}>Adultes:</strong> {r.adults} <strong style={{ color: '#d9a441' }}>Enfants:</strong> {r.children}</div>
                    <div><strong style={{ color: '#d9a441' }}>Chambre:</strong> {r.roomType}</div>
                    {r.message && <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#d9a441' }}>Message:</strong> {r.message}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {r.status !== 'confirmed' && <button className="btn btn-sm" style={{ background: '#66bb6a', color: '#fff', border: 'none' }} onClick={() => updateStatus(r.id, 'confirmed')}>Confirmer</button>}
                  {r.status !== 'cancelled' && <button className="btn btn-sm" style={{ background: '#ef5350', color: '#fff', border: 'none' }} onClick={() => updateStatus(r.id, 'cancelled')}>Annuler</button>}
                  {r.status !== 'completed' && <button className="btn btn-sm" style={{ background: '#42a5f5', color: '#fff', border: 'none' }} onClick={() => updateStatus(r.id, 'completed')}>Terminer</button>}
                  <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }} onClick={() => deleteReservation(r.id)}>Suppr.</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
