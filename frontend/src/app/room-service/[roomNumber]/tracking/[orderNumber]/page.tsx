'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RoomServiceTracking from '@/components/room-service/RoomServiceTracking';
import { Order, API } from '@/components/room-service/types';

export default function RoomServiceTrackingPage() {
  const { roomNumber, orderNumber } = useParams<{ roomNumber: string; orderNumber: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (window as any).__rs_updateOrder = setOrder;
    return () => { delete (window as any).__rs_updateOrder; };
  }, []);

  useEffect(() => {
    fetch(`${API}/api/room-service/orders/number/${orderNumber}`)
      .then((r) => r.json())
      .then((j) => { setOrder(j.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orderNumber]);

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
    <RoomServiceTracking
      trackingOrder={order}
      onBack={() => router.push(`/room-service/${roomNumber}`)}
      onHistory={() => router.push(`/room-service/${roomNumber}`)}
      roomNumber={roomNumber}
    />
  );
}
