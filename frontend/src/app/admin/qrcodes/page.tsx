'use client';

import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://nika-hotel-premium.vercel.app';

type Room = { id: number; name: string; slug: string };

let _baseUrl = FRONTEND_URL;

export default function AdminQRCodes() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState(FRONTEND_URL);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState('');

  const fetchRooms = () => {
    setLoading(true);
    fetch(`${API}/api/rooms`)
      .then((r) => r.json())
      .then((j) => { setRooms(j.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  useEffect(() => { _baseUrl = baseUrl; }, [baseUrl]);

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
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `qrcode-chambre-${roomNumber}.png`;
    a.click();
  };

  const printSingle = (roomNumber: string) => {
    const canvas = document.getElementById(`qr-${roomNumber}`) as HTMLCanvasElement;
    if (!canvas) return;
    const url = buildUrl(roomNumber);
    const imgSrc = canvas.toDataURL('image/png');
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>QR Chambre ${roomNumber}</title></head>
      <body style="text-align:center;padding:40px;font-family:sans-serif">
        <h2>Chambre ${roomNumber}</h2>
        <p>Scanner pour commander</p>
        <img src="${imgSrc}" style="width:300px;height:300px"/>
        <p style="margin-top:20px;color:#666">${url}</p>
        <script>window.print()</script>
      </body></html>
    `);
    win.document.close();
  };

  const printAll = () => {
    setTimeout(() => {
      const html = roomNumbers.map((room) => {
        const canvas = document.getElementById(`qr-print-${room.number}`) as HTMLCanvasElement;
        const imgSrc = canvas ? canvas.toDataURL('image/png') : '';
        return `
          <div class="qr-card">
            <h2>Chambre ${room.number}</h2>
            <p class="room-type">${room.name}</p>
            <div class="qr-img-wrap"><img src="${imgSrc}" width="220" height="220" alt="QR Chambre ${room.number}"/></div>
            <p class="qr-url">${_baseUrl}/room-service/${room.number}</p>
            <p class="qr-label">Scannez pour commander depuis votre chambre</p>
          </div>
        `;
      }).join('');

      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`
        <!DOCTYPE html>
        <html><head><title>QR Codes Room Service - NIKA HOTEL</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Jost', 'Inter', Arial, sans-serif; padding: 30px; background: #fff; color: #1a1a2e; }
          .print-header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #d9a441; }
          .print-header h1 { font-size: 22px; font-weight: 700; color: #06152f; margin-bottom: 4px; letter-spacing: 1px; }
          .print-header .sub { color: #d9a441; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; }
          .qr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
          .qr-card { border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; text-align: center; page-break-inside: avoid; break-inside: avoid; }
          .qr-card h2 { font-size: 16px; color: #06152f; margin-bottom: 2px; }
          .room-type { font-size: 12px; color: #888; margin-bottom: 12px; }
          .qr-img-wrap { background: #fff; padding: 10px; border-radius: 8px; display: inline-block; margin-bottom: 10px; }
          .qr-url { font-size: 10px; color: #666; word-break: break-all; margin-bottom: 6px; font-family: monospace; }
          .qr-label { font-size: 11px; color: #d9a441; font-weight: 600; }
          @media print { body { padding: 20px; } .qr-grid { grid-template-columns: repeat(3, 1fr); } }
          @media (max-width: 800px) { .qr-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 500px) { .qr-grid { grid-template-columns: 1fr; } }
        </style>
        </head><body>
          <div class="print-header">
            <h1>NIKA HOTEL</h1>
            <p class="sub">QR Codes Room Service</p>
          </div>
          <div class="qr-grid">${html}</div>
          <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); };<\/script>
        </body></html>
      `);
      win.document.close();
    }, 300);
  };

  const downloadAll = () => {
    roomNumbers.forEach((room) => {
      setTimeout(() => downloadQR(room.number), parseInt(room.number) * 30);
    });
  };

  const copyUrl = async (roomNumber: string) => {
    try {
      await navigator.clipboard.writeText(buildUrl(roomNumber));
      setCopied(roomNumber);
      setTimeout(() => setCopied(''), 2000);
    } catch {}
  };

  const testUrl = (roomNumber: string) => window.open(buildUrl(roomNumber), '_blank');

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

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={printAll} style={{ padding: '12px 28px', fontSize: 15 }}>
          🖨️ Tout imprimer
        </button>
        <button className="btn btn-sm" onClick={downloadAll} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>
          Tout télécharger
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
        {roomNumbers.map((room) => {
          const url = buildUrl(room.number);
          return (
            <div key={room.number} className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
              <h3 style={{ fontSize: 18, color: '#fff', marginBottom: 4, fontFamily: "'Bodoni Moda', serif" }}>
                Chambre {room.number}
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{room.name}</p>
              <div style={{ background: '#fff', borderRadius: 16, padding: 16, display: 'inline-block', marginBottom: 16 }}>
                <QRCodeCanvas
                  id={`qr-${room.number}`}
                  value={url}
                  size={280}
                  level="H"
                  includeMargin
                />
                <QRCodeCanvas
                  id={`qr-print-${room.number}`}
                  value={url}
                  size={220}
                  level="H"
                  includeMargin
                  style={{ display: 'none' }}
                />
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', wordBreak: 'break-all', marginBottom: 14, fontFamily: 'monospace' }}>{url}</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }} onClick={() => downloadQR(room.number)}>
                  Télécharger
                </button>
                <button className="btn btn-sm btn-primary" onClick={() => printSingle(room.number)}>
                  Imprimer
                </button>
                <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }} onClick={() => copyUrl(room.number)}>
                  {copied === room.number ? 'Copié ✓' : 'Copier URL'}
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
