'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type Message = {
  id: number; name: string; email: string | null;
  subject: string; message: string; createdAt: string;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Message | null>(null);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());

  const fetchMessages = () => {
    setLoading(true);
    fetch(`${API}/api/contact`)
      .then((r) => r.json())
      .then((j) => { setMessages(j.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const deleteMessage = async (id: number) => {
    if (!confirm('Supprimer ce message ?')) return;
    await fetch(`${API}/api/contact/${id}`, { method: 'DELETE' });
    if (selected?.id === id) setSelected(null);
    fetchMessages();
  };

  const filtered = messages.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const markRead = (id: number) => setReadIds((p) => new Set(p).add(id));

  const toggleRead = (id: number) => {
    setReadIds((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 48 }}>Chargement...</p>;

  return (
    <div style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', marginBottom: 4 }}>Messages</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24 }}>Boîte de réception — messages du formulaire contact</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <input placeholder="Rechercher un message..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, height: 42, padding: '0 16px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fbff', fontFamily: "'Jost', sans-serif", fontSize: 14, outline: 'none' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: 48 }}>Aucun message trouvé.</p>
          ) : (
            filtered.map((m) => {
              const isRead = readIds.has(m.id);
              return (
                <div key={m.id} className="glass-card msg-card" onClick={() => { setSelected(m); markRead(m.id); }}
                  style={{ padding: 16, cursor: 'pointer', borderLeft: isRead ? '3px solid transparent' : '3px solid #d9a441', animation: 'fadeIn 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <strong style={{ color: isRead ? 'rgba(255,255,255,0.5)' : '#fff', fontSize: 15 }}>{m.name}</strong>
                      {!isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d9a441' }} />}
                    </div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{new Date(m.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {m.subject && <p style={{ fontSize: 12, color: '#d9a441', margin: '0 0 4px' }}>{m.subject}</p>}
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.message}</p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
                    <button className="msg-btn" onClick={(e) => { e.stopPropagation(); toggleRead(m.id); }}>{isRead ? '📖' : '📩'}</button>
                    <button className="msg-btn" style={{ color: '#ef5350' }} onClick={(e) => { e.stopPropagation(); deleteMessage(m.id); }}>🗑️</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {selected && (
          <div className="glass-card" style={{ padding: 24, animation: 'fadeIn 0.2s', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: 18, fontFamily: "'Bodoni Moda', serif" }}>{selected.name}</h3>
                {selected.email && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{selected.email}</span>}
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{new Date(selected.createdAt).toLocaleString('fr-FR')}</span>
            </div>
            {selected.subject && <p style={{ fontSize: 14, color: '#d9a441', marginBottom: 12 }}><strong>Sujet:</strong> {selected.subject}</p>}
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: '0 0 20px', whiteSpace: 'pre-wrap' }}>{selected.message}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline" onClick={() => { setSelected(null); toggleRead(selected.id); }} style={{ height: 38, borderRadius: 999, padding: '0 20px', fontSize: 13 }}>Fermer</button>
              <button className="btn btn-sm" onClick={() => deleteMessage(selected.id)} style={{ background: '#ef5350', color: '#fff', border: 'none', borderRadius: 999, height: 38, padding: '0 20px', fontSize: 13, cursor: 'pointer' }}>Supprimer</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .msg-card { transition: transform 0.15s, background 0.15s; }
        .msg-card:hover { background: rgba(255,255,255,0.05); transform: translateX(2px); }
        .msg-btn { width: 32px; height: 32px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .msg-btn:hover { background: rgba(255,255,255,0.1); }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
