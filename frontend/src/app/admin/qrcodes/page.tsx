'use client';

import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://nika-hotel-premium.vercel.app';

type Room = {
  id: number;
  name: string;
  slug: string;
};

export default function AdminQRCodes() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState(FRONTEND_URL);
  const [editing, setEditing] = useState(false);

  const fetchRooms = () => {
    setLoading(true);
    fetch(`${API}/api/rooms`)
      .then((r) => r.json())
      .then((j) => { setRooms(j.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  const defaultRooms = [
    { name: 'Chambre Standard', slug: 'standard' },
    { name: 'Chambre Deluxe', slug: 'deluxe' },
    { name: 'Suite Premium', slug: 'premium' },
  ];

  const roomNumbers = rooms.length > 0
    ? rooms.map((_, i) => ({ number: (101 + i).toString(), name: rooms[i]?.name || `Chambre ${101 + i}` }))
    : defaultRooms.map((r, i) => ({ number: (101 + i).toString(), name: r.name }));

  const buildUrl = (roomNumber: string) => `${baseUrl}/room-service/${roomNumber}`;

  const downloadQR = (roomNumber: string) => {
    const canvas = document.getElementById(`qr-${roomNumber}`) as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-chambre-${roomNumber}.png`;
    a.click();
  };

  const printQR = (roomNumber: string) => {
    const canvas = document.getElementById(`qr-${roomNumber}`) as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>QR Chambre ${roomNumber}</title></head>
      <body style="text-align:center;padding:40px;font-family:sans-serif">
        <h2>Chambre ${roomNumber}</h2>
        <p>Scanner pour commander</p>
        <img src="${url}" style="width:300px;height:300px"/>
        <p style="margin-top:20px;color:#666">${buildUrl(roomNumber)}</p>
        <script>window.print()</script>
      </body></html>
    `);
    win.document.close();
  };

  const testUrl = (roomNumber: string) => {
    window.open(buildUrl(roomNumber), '_blank');
  };

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 48 }}>Chargement...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: "'Bodoni Moda', serif", color: '#fff' }}>QR Codes</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 }}>
            Codes QR pour le room service — à imprimer et placer dans chaque chambre
          </p>
        </div>
        <button className="btn btn-sm btn-outline" onClick={() => setEditing(!editing)} style={{ fontSize: 12 }}>
          {editing ? 'Fermer' : 'Modifier URL'}
        </button>
      </div>

      {editing && (
        <div className="glass-card" style={{ padding: 20, marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#d9a441', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 500 }}>
            URL de base pour les QR codes
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f8fbff', fontFamily: "'Jost', sans-serif", fontSize: 14, outline: 'none',
              }}
              placeholder="https://nika-hotel-premium.vercel.app"
            />
            <button className="btn btn-sm btn-primary" onClick={() => setEditing(false)}>Appliquer</button>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
            Les QR codes pointeront vers : {baseUrl}/room-service/XXX
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
        {roomNumbers.map((room) => {
          const url = buildUrl(room.number);
          return (
            <div key={room.number} className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
              <h3 style={{ fontSize: 16, color: '#fff', marginBottom: 4, fontFamily: "'Bodoni Moda', serif" }}>
                Chambre {room.number}
              </h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>{room.name}</p>
              <div style={{ background: '#fff', borderRadius: 12, padding: 12, display: 'inline-block', marginBottom: 12 }}>
                <QRCodeCanvas
                  id={`qr-${room.number}`}
                  value={url}
                  size={160}
                  level="M"
                  includeMargin
                />
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', wordBreak: 'break-all', marginBottom: 12 }}>{url}</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }} onClick={() => downloadQR(room.number)}>
                  Télécharger
                </button>
                <button className="btn btn-sm btn-primary" onClick={() => printQR(room.number)}>
                  Imprimer
                </button>
                <button className="btn btn-sm" style={{ background: '#25D366', color: '#fff', border: 'none' }} onClick={() => testUrl(room.number)}>
                  Tester
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
