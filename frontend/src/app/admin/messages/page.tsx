'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type Message = {
  id: number;
  name: string;
  email: string | null;
  subject: string;
  message: string;
  createdAt: string;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchMessages();
  };

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)' }}>Chargement...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "'Bodoni Moda', serif", color: '#fff' }}>Messages</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 14 }}>Messages reçus via le formulaire de contact</p>

      {messages.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 48 }}>Aucun message pour le moment.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m) => (
            <div key={m.id} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <strong style={{ color: '#fff', fontSize: 15 }}>{m.name}</strong>
                  {m.email && <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 12, fontSize: 13 }}>{m.email}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                  <button className="btn btn-sm" style={{ background: '#ef5350', color: '#fff', border: 'none' }} onClick={() => deleteMessage(m.id)}>Suppr.</button>
                </div>
              </div>
              {m.subject && <p style={{ fontSize: 13, color: '#d9a441', margin: '0 0 6px' }}>Sujet: {m.subject}</p>}
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
