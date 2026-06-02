'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type Room = {
  id: number; name: string; slug: string; description: string;
  price: number | null; currency: string; capacity: number;
  imageUrl: string | null; amenities: string; isAvailable: boolean;
};

const emptyRoom = { name: '', slug: '', description: '', price: null, currency: 'FBU', capacity: 2, imageUrl: '', amenities: '', isAvailable: true };

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Room> | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterAvail, setFilterAvail] = useState('all');

  const fetchRooms = () => {
    setLoading(true);
    fetch(`${API}/api/rooms`)
      .then((r) => r.json())
      .then((j) => { setRooms(j.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  const filtered = rooms.filter((r) => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.slug.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterAvail === 'available' && !r.isAvailable) return false;
    if (filterAvail === 'unavailable' && r.isAvailable) return false;
    return true;
  });

  const handleSave = async () => {
    if (!editing?.name || !editing?.description) return;
    setSaving(true);
    const isNew = !editing.id;
    const url = isNew ? `${API}/api/rooms` : `${API}/api/rooms/${editing.id}`;
    const body: any = { ...editing };
    if (body.price) body.price = Number(body.price);
    body.amenities = body.amenities || '';
    body.slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setSaving(false); setEditing(null); fetchRooms();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette chambre ?')) return;
    await fetch(`${API}/api/rooms/${id}`, { method: 'DELETE' });
    fetchRooms();
  };

  const createSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 48 }}>Chargement...</p>;

  return (
    <div style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', margin: 0 }}>Gestion des Chambres</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>Ajouter, modifier ou supprimer des chambres</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing(emptyRoom)} style={{ height: 42, borderRadius: 999, padding: '0 24px', fontSize: 14 }}>+ Ajouter une chambre</button>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          placeholder="Rechercher une chambre..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, height: 42, padding: '0 16px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fbff', fontFamily: "'Jost', sans-serif", fontSize: 14, outline: 'none' }}
        />
        <select value={filterAvail} onChange={(e) => setFilterAvail(e.target.value)}
          style={{ height: 42, padding: '0 16px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fbff', fontFamily: "'Jost', sans-serif", fontSize: 14, outline: 'none' }}>
          <option value="all" style={{ background: '#1a1a2e' }}>Toutes</option>
          <option value="available" style={{ background: '#1a1a2e' }}>Disponibles</option>
          <option value="unavailable" style={{ background: '#1a1a2e' }}>Indisponibles</option>
        </select>
      </div>

      {editing && (
        <div className="glass-card" style={{ padding: 32, marginBottom: 32, animation: 'fadeIn 0.2s' }}>
          <h3 style={{ color: '#fff', marginBottom: 24, fontFamily: "'Bodoni Moda', serif", fontSize: 18 }}>
            {editing.id ? 'Modifier' : 'Ajouter'} une chambre
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-field"><label>Nom *</label>
              <input className="admin-input" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : createSlug(e.target.value) })} /></div>
            <div className="form-field"><label>Slug</label>
              <input className="admin-input" value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
            <div className="form-field" style={{ gridColumn: '1 / -1' }}><label>Description *</label>
              <textarea className="admin-input" rows={3} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="form-field"><label>Prix (FBU)</label>
              <input className="admin-input" type="number" value={editing.price ?? ''} onChange={(e) => setEditing({ ...editing, price: e.target.value ? Number(e.target.value) : null })} /></div>
            <div className="form-field"><label>Capacité</label>
              <input className="admin-input" type="number" value={editing.capacity ?? 2} onChange={(e) => setEditing({ ...editing, capacity: Number(e.target.value) })} /></div>
            <div className="form-field"><label>Image URL</label>
              <input className="admin-input" value={editing.imageUrl || ''} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} /></div>
            <div className="form-field" style={{ gridColumn: '1 / -1' }}><label>Équipements (virgules)</label>
              <input className="admin-input" value={editing.amenities || ''} onChange={(e) => setEditing({ ...editing, amenities: e.target.value })} placeholder="WiFi, Climatisation, TV, ..." /></div>
            <div className="form-field"><label>Disponible</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 14, marginTop: 8 }}>
                <input type="checkbox" checked={!!editing.isAvailable} onChange={(e) => setEditing({ ...editing, isAvailable: e.target.checked })} />
                {editing.isAvailable ? 'Oui' : 'Non'}
              </label></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ height: 42, borderRadius: 999, padding: '0 28px' }}>{saving ? 'Sauvegarde...' : 'Enregistrer'}</button>
            <button className="btn btn-outline" onClick={() => setEditing(null)} style={{ height: 42, borderRadius: 999, padding: '0 28px' }}>Annuler</button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.3)' }}>
          <p style={{ fontSize: 48, marginBottom: 8 }}>🏨</p>
          <p>{rooms.length === 0 ? 'Aucune chambre. Ajoutez-en une !' : 'Aucun résultat pour votre recherche.'}</p>
        </div>
      ) : (
        <div className="rooms-grid premium-scroll">
          {filtered.map((r) => (
            <div key={r.id} className="glass-card room-card-premium">
              {r.imageUrl && <div className="room-card-img" style={{ backgroundImage: `url(${r.imageUrl})` }}>
                <span className={`room-badge ${r.isAvailable ? 'badge-ok' : 'badge-no'}`}>{r.isAvailable ? 'Disponible' : 'Indisponible'}</span>
              </div>}
              <div style={{ padding: r.imageUrl ? '16px' : '20px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <h3 style={{ fontSize: 17, color: '#fff', margin: 0, fontFamily: "'Bodoni Moda', serif" }}>{r.name}</h3>
                  <span style={{ color: '#d9a441', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>{r.price ? `${r.price.toLocaleString()} FBU` : 'Sur demande'}</span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.description}</p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 999 }}>👤 {r.capacity} pers.</span>
                  {r.amenities && r.amenities.split(',').slice(0, 3).map((a, i) => (
                    <span key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 999 }}>{a.trim()}</span>
                  ))}
                </div>
                <div className="room-actions">
                  <button className="btn-sm-qr" onClick={() => setEditing(r)}>✏️ Modifier</button>
                  <button className="btn-sm-qr" style={{ color: '#ef5350', borderColor: 'rgba(239,83,80,0.3)' }} onClick={() => handleDelete(r.id)}>🗑️ Supprimer</button>
                  <Link href={`/admin/qrcodes`} className="btn-sm-qr" style={{ textDecoration: 'none' }}>📱 QR Code</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .rooms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px; }
        .room-card-premium { overflow: hidden; padding: 0; transition: transform 0.2s, box-shadow 0.2s; }
        .room-card-premium:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
        .room-card-img { height: 170px; background-size: cover; background-position: center; position: relative; }
        .room-badge { position: absolute; top: 12px; right: 12px; padding: 4px 14px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .badge-ok { background: rgba(102,187,106,0.9); color: #fff; }
        .badge-no { background: rgba(239,83,80,0.9); color: #fff; }
        .room-actions { display: flex; gap: 6px; flex-wrap: wrap; }
        .room-actions .btn-sm-qr { height: 34px; padding: 0 14px; border-radius: 999px; font-size: 12px; font-weight: 500; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #fff; cursor: pointer; font-family: 'Jost', sans-serif; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s; }
        .room-actions .btn-sm-qr:hover { background: rgba(255,255,255,0.12); }
        .admin-input { width: 100%; padding: 12px 16px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #f8fbff; font-family: 'Jost', sans-serif; font-size: 14px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .admin-input:focus { border-color: #d9a441; background: rgba(255,255,255,0.08); }
        .form-field label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #d9a441; font-weight: 500; margin-bottom: 6px; }
        @media (max-width: 600px) {
          .rooms-grid { grid-template-columns: 1fr; }
          .room-card-img { height: 140px; }
        }
      `}</style>
    </div>
  );
}
