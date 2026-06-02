'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RoomServiceTracking from '@/components/room-service/RoomServiceTracking';
import { Order, API, statusLabels } from '@/components/room-service/types';

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

export default function RoomServiceTrackingPage() {
  const { roomNumber, orderNumber } = useParams<{ roomNumber: string; orderNumber: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const prevStatusRef = useRef<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (window as any).__rs_updateOrder = setOrder;
    return () => { delete (window as any).__rs_updateOrder; };
  }, []);

  useEffect(() => {
    fetch(`${API}/api/room-service/orders/number/${orderNumber}`)
      .then((r) => r.json())
      .then((j) => {
        const o = j.data as Order;
        setOrder(o);
        prevStatusRef.current = o.status;
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderNumber]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    if (!order) return;
    const iv = setInterval(async () => {
      try {
        const res = await fetch(`${API}/api/room-service/orders/number/${orderNumber}`);
        const json = await res.json();
        if (json.data) {
          const o = json.data as Order;
          if (prevStatusRef.current && prevStatusRef.current !== o.status) {
            playNotificationSound();
            vibrate();
            const label = statusLabels[o.status] || `Statut: ${o.status}`;
            showToast(label);
            prevStatusRef.current = o.status;
          }
          setOrder(o);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(iv);
  }, [order, orderNumber, showToast]);

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', background: '#06152f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Chargement...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: '100dvh', background: '#06152f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', marginBottom: 8 }}>Commande introuvable</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 24 }}>{orderNumber}</p>
        <button onClick={() => router.push(`/room-service/${roomNumber}`)} style={{ height: 44, padding: '0 28px', borderRadius: 999, border: 'none', background: 'linear-gradient(135deg, #d9a441, #ffe2a0)', color: '#1b1305', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          background: 'linear-gradient(135deg, #d9a441, #ffe2a0)', color: '#1b1305',
          padding: '14px 28px', borderRadius: 999, fontWeight: 700, fontSize: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'toastDrop 0.35s cubic-bezier(0.68,-0.55,0.265,1.55)',
          textAlign: 'center', maxWidth: '90vw',
        }}>
          {toast}
        </div>
      )}
      <RoomServiceTracking
        trackingOrder={order}
        onBack={() => router.push(`/room-service/${roomNumber}`)}
        onHistory={() => router.push(`/room-service/${roomNumber}`)}
        roomNumber={roomNumber}
      />
      <style>{`
        @keyframes toastDrop {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.9); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
