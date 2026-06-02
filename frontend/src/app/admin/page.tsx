'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      sessionStorage.setItem('nika_admin', JSON.stringify(json.data));
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06152f', padding: 24 }}>
      <form onSubmit={handleLogin} className="glass-card" style={{ padding: 48, width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff' }}>NIKA HOTEL</div>
          <div style={{ color: '#d9a441', fontSize: 14, textTransform: 'uppercase', letterSpacing: 4, marginTop: 8 }}>Admin Panel</div>
        </div>
        {error && <div style={{ background: 'rgba(255,50,50,0.15)', color: '#ff6b6b', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>{error}</div>}
        <div className="form-field" style={{ marginBottom: 20 }}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="admin@nikahotel.com" value={email} onChange={(e) => setEmail(e.target.value)} className="booking-form-input" required />
        </div>
        <div className="form-field" style={{ marginBottom: 28 }}>
          <label htmlFor="password">Mot de passe</label>
          <input id="password" type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="booking-form-input" required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: 16 }} disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      <style>{`
        .booking-form-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #f8fbff;
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s;
          box-sizing: border-box;
        }
        .booking-form-input:focus {
          border-color: #d9a441;
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 3px rgba(217,164,65,0.1);
        }
        .booking-form-input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}
