'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type Room = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  currency: string;
  capacity: number;
  imageUrl: string | null;
  amenities: string;
  isAvailable: boolean;
};

const emptyRoom = { name: '', slug: '', description: '', price: null, currency: 'FBU', capacity: 2, imageUrl: '', amenities: '', isAvailable: true };

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Room> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchRooms = () => {
    setLoading(true);
    fetch(`${API}/api/rooms`)
      .then((r) => r.json())
      .then((j) => { setRooms(j.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSave = async () => {
    if (!editing?.name || !editing?.description) return;
    setSaving(true);
    const isNew = !editing.id;
    const url = isNew ? `${API}/api/rooms` : `${API}/api/rooms/${editing.id}`;
    const method = isNew ? 'POST' : 'PUT';
    const body: any = { ...editing };
    if (body.price) body.price = Number(body.price);
    body.amenities = body.amenities || '';
    body.slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setSaving(false);
    setEditing(null);
    fetchRooms();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette chambre ?')) return;
    await fetch(`${API}/api/rooms/${id}`, { method: 'DELETE' });
    fetchRooms();
  };

  const createSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)' }}>Chargement...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', margin: 0 }}>Gestion des Chambres</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 }}>Ajouter, modifier ou supprimer des chambres</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing(emptyRoom)}>+ Ajouter</button>
      </div>

      {editing && (
        <div className="glass-card" style={{ padding: 32, marginBottom: 32 }}>
          <h3 style={{ color: '#fff', marginBottom: 24, fontFamily: "'Bodoni Moda', serif", fontSize: 18 }}>
            {editing.id ? 'Modifier' : 'Ajouter'} une chambre
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-field">
              <label>Nom *</label>
              <input className="admin-input" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : createSlug(e.target.value) })} />
            </div>
            <div className="form-field">
              <label>Slug</label>
              <input className="admin-input" value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </div>
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label>Description *</label>
              <textarea className="admin-input" rows={3} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Prix</label>
              <input className="admin-input" type="number" value={editing.price ?? ''} onChange={(e) => setEditing({ ...editing, price: e.target.value ? Number(e.target.value) : null })} />
            </div>
            <div className="form-field">
              <label>Devise</label>
              <input className="admin-input" value={editing.currency || 'FBU'} onChange={(e) => setEditing({ ...editing, currency: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Capacité</label>
              <input className="admin-input" type="number" value={editing.capacity ?? 2} onChange={(e) => setEditing({ ...editing, capacity: Number(e.target.value) })} />
            </div>
            <div className="form-field">
              <label>Image URL</label>
              <input className="admin-input" value={editing.imageUrl || ''} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} />
            </div>
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label>Équipements (séparés par des virgules)</label>
              <input className="admin-input" value={editing.amenities || ''} onChange={(e) => setEditing({ ...editing, amenities: e.target.value })} placeholder="WiFi, Climatisation, TV, ..." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Sauvegarde...' : 'Enregistrer'}</button>
            <button className="btn btn-outline" onClick={() => setEditing(null)}>Annuler</button>
          </div>
        </div>
      )}

      {rooms.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 48 }}>Aucune chambre. Ajoutez-en une !</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {rooms.map((r) => (
            <div key={r.id} className="glass-card" style={{ padding: 20 }}>
              {r.imageUrl && <div style={{ height: 160, borderRadius: 12, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${r.imageUrl})`, marginBottom: 12 }} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ fontSize: 16, color: '#fff', margin: 0, fontFamily: "'Bodoni Moda', serif" }}>{r.name}</h3>
                <span style={{ color: '#d9a441', fontWeight: 600, fontSize: 14 }}>{r.price ? `${r.price} ${r.currency}` : 'Sur demande'}</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', lineHeight: 1.5 }}>{r.description}</p>
              {r.amenities && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{r.amenities}</p>}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }} onClick={() => setEditing(r)}>Modifier</button>
                <button className="btn btn-sm" style={{ background: '#ef5350', color: '#fff', border: 'none' }} onClick={() => handleDelete(r.id)}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .admin-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #f8fbff;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.3s;
          box-sizing: border-box;
        }
        .admin-input:focus { border-color: #d9a441; background: rgba(255,255,255,0.08); }
        .admin-input::placeholder { color: rgba(255,255,255,0.3); }
        .form-field label { display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #d9a441; font-weight: 500; margin-bottom: 6px; }
      `}</style>
    </div>
  );
}
