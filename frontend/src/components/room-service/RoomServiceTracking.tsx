'use client';

import { useEffect, useRef } from 'react';
import { hotel } from '@/data/site';
import { Order, statusSteps, statusIndex, statusLabels } from './types';

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch {}
}

function vibrate() {
  try { navigator.vibrate?.([100, 80, 100]); } catch {}
}

export default function RoomServiceTracking({
  trackingOrder,
  onBack,
  onHistory,
  roomNumber,
}: {
  trackingOrder: Order;
  onBack: () => void;
  onHistory: () => void;
  roomNumber: string;
}) {
  const prevStatusRef = useRef(trackingOrder.status);

  useEffect(() => {
    const iv = setInterval(async () => {
      try {
        const { API } = await import('./types');
        const res = await fetch(`${API}/api/room-service/orders/number/${trackingOrder.orderNumber}`);
        const json = await res.json();
        if (json.data) {
          const newStatus = json.data.status;
          if (prevStatusRef.current !== newStatus) {
            playNotificationSound();
            vibrate();
            prevStatusRef.current = newStatus;
          }
          (window as any).__rs_updateOrder?.(json.data);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(iv);
  }, [trackingOrder.orderNumber]);

  const currentIdx = statusIndex[trackingOrder.status] ?? 0;

  return (
    <div style={{ minHeight: '100dvh', background: '#06152f', display: 'flex', flexDirection: 'column', padding: '60px 24px 32px', alignItems: 'center' }}>
      <div style={{ width: 60, height: 60, borderRadius: 22, background: 'linear-gradient(135deg, #d9a441, #ffe2a0)', color: '#1b1305', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Jost', sans-serif", fontSize: 22, fontWeight: 900, marginBottom: 16, boxShadow: '0 16px 48px rgba(217,164,65,0.25)' }}>NH</div>
      <div style={{ fontSize: 11, color: '#d9a441', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 4, fontWeight: 500 }}>NIKA HOTEL</div>
      <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', margin: '0 0 4px' }}>
        Suivi de commande
      </h1>
      <div style={{ fontSize: 14, color: '#d9a441', fontWeight: 600, marginBottom: 4 }}>{trackingOrder.orderNumber}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 32 }}>
        Chambre {trackingOrder.roomNumber}
      </div>

      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', marginBottom: 32 }}>
        {statusSteps.map((step, idx) => {
          const active = idx <= currentIdx;
          const isLast = idx === statusSteps.length - 1;
          return (
            <div key={step.key} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: active ? 'linear-gradient(135deg, #d9a441, #ffe2a0)' : 'rgba(255,255,255,0.06)',
                  color: active ? '#1b1305' : 'rgba(255,255,255,0.2)',
                  fontSize: active ? 16 : 14, fontWeight: 700,
                  transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  boxShadow: active ? '0 4px 16px rgba(217,164,65,0.3)' : 'none',
                }}>
                  {active ? step.emoji : idx + 1}
                </div>
                {!isLast && (
                  <div style={{
                    width: 2, flex: 1, minHeight: 32,
                    background: active && currentIdx > idx ? 'var(--gold)' : 'rgba(255,255,255,0.08)',
                    transition: 'background 0.5s',
                  }} />
                )}
              </div>
              <div style={{ paddingTop: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: active ? '#fff' : 'rgba(255,255,255,0.25)', transition: 'color 0.3s' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 12, color: active ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)', marginTop: 2 }}>
                  {active ? statusLabels[step.key] : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {onBack && (
          <button onClick={onBack} style={{ width: '100%', height: 48, borderRadius: 999, border: 'none', background: 'linear-gradient(135deg, #d9a441, #ffe2a0)', color: '#1b1305', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'Jost', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            🏠 Retour accueil chambre
          </button>
        )}
        {onHistory && (
          <button onClick={onHistory} style={{ width: '100%', height: 42, borderRadius: 999, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: "'Jost', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            📦 Historique des commandes
          </button>
        )}
        <a href={`tel:${hotel.phone1}`} style={{ width: '100%', height: 42, borderRadius: 999, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: "'Jost', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          Appeler la réception
        </a>
      </div>
    </div>
  );
}
