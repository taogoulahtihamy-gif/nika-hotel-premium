'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type Reservation = {
  id: number; fullName: string; phone: string; email: string | null;
  checkIn: string; checkOut: string; adults: number; children: number;
  roomType: string; message: string | null; status: string; createdAt: string;
};

const statusConfig: Record<string, { label: string; bg: string }> = {
  pending: { label: 'En attente', bg: '#ffa726' },
  confirmed: { label: 'Confirmée', bg: '#66bb6a' },
  checked_in: { label: 'Check-in', bg: '#42a5f5' },
  checked_out: { label: 'Check-out', bg: '#ab47bc' },
  cancelled: { label: 'Annulée', bg: '#ef5350' },
};

const filterStatuses = ['all', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];

export default function AdminReservations() {
  const [data, setData] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const loadData = () => {
    setLoading(true);
    fetch(`${API}/api/reservations`)
      .then((r) => r.json())
      .then((j) => { setData(j.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API}/api/reservations/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    loadData();
  };

  const deleteRes = async (id: number) => {
    if (!confirm('Supprimer cette réservation ?')) return;
    await fetch(`${API}/api/reservations/${id}`, { method: 'DELETE' });
    loadData();
  };

  const filtered = data.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search && !r.fullName.toLowerCase().includes(search.toLowerCase()) && !r.phone.includes(search)) return false;
    return true;
  });

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 48 }}>Chargement...</p>;

  return (
    <div style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', marginBottom: 4 }}>Réservations CRM</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24 }}>Gérer les réservations des clients</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <input placeholder="Rechercher un client..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, height: 42, padding: '0 16px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fbff', fontFamily: "'Jost', sans-serif", fontSize: 14, outline: 'none' }} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {filterStatuses.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ height: 36, padding: '0 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 500,
                background: filter === s ? 'linear-gradient(135deg, #d9a441, #ffe2a0)' : 'rgba(255,255,255,0.06)',
                color: filter === s ? '#1b1305' : 'rgba(255,255,255,0.6)' }}>
              {s === 'all' ? 'Tous' : (statusConfig[s]?.label || s)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: 48 }}>Aucune réservation trouvée.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((r) => {
            const cfg = statusConfig[r.status] || { label: r.status, bg: '#999' };
            return (
              <div key={r.id} className="glass-card" style={{ padding: 20, animation: 'fadeIn 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{r.fullName}</span>
                      <span style={{ background: cfg.bg, color: '#fff', borderRadius: 999, padding: '3px 14px', fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>{cfg.label}</span>
                    </div>
                    <div className="res-grid">
                      <div><span className="res-label">Tél</span><span className="res-val">{r.phone}</span></div>
                      {r.email && <div><span className="res-label">Email</span><span className="res-val">{r.email}</span></div>}
                      <div><span className="res-label">Arrivée</span><span className="res-val">{new Date(r.checkIn).toLocaleDateString('fr-FR')}</span></div>
                      <div><span className="res-label">Départ</span><span className="res-val">{new Date(r.checkOut).toLocaleDateString('fr-FR')}</span></div>
                      <div><span className="res-label">Adultes</span><span className="res-val">{r.adults} · Enfants {r.children}</span></div>
                      <div><span className="res-label">Chambre</span><span className="res-val">{r.roomType}</span></div>
                      {r.message && <div style={{ gridColumn: '1 / -1' }}><span className="res-label">Message</span><span className="res-val" style={{ fontStyle: 'italic' }}>{r.message}</span></div>}
                    </div>
                  </div>
                  <div className="res-actions">
                    {r.status === 'pending' && <button className="res-btn" style={{ background: '#66bb6a', color: '#fff' }} onClick={() => updateStatus(r.id, 'confirmed')}>Confirmer</button>}
                    {r.status === 'confirmed' && <button className="res-btn" style={{ background: '#42a5f5', color: '#fff' }} onClick={() => updateStatus(r.id, 'checked_in')}>Check-in</button>}
                    {r.status === 'checked_in' && <button className="res-btn" style={{ background: '#ab47bc', color: '#fff' }} onClick={() => updateStatus(r.id, 'checked_out')}>Check-out</button>}
                    {r.status !== 'cancelled' && r.status !== 'checked_out' && <button className="res-btn" style={{ background: '#ef5350', color: '#fff' }} onClick={() => updateStatus(r.id, 'cancelled')}>Annuler</button>}
                    <button className="res-btn" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }} onClick={() => deleteRes(r.id)}>🗑️</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .res-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 6px; font-size: 13px; }
        .res-label { color: #d9a441; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px; }
        .res-val { color: rgba(255,255,255,0.7); }
        .res-actions { display: flex; gap: 6px; flex-wrap: wrap; }
        .res-btn { height: 34px; padding: 0 16px; border-radius: 999px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; font-family: 'Jost', sans-serif; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s; }
        .res-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        @media (max-width: 600px) {
          .res-grid { grid-template-columns: 1fr 1fr; }
          .res-actions { width: 100%; justify-content: flex-end; }
        }
      `}</style>
    </div>
  );
}
