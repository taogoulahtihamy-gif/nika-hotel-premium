'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type Order = {
  id: number;
  roomNumber: string;
  status: string;
};

type NotificationContextType = {
  notificationCount: number;
  audioEnabled: boolean;
  toggleAudio: () => void;
  resetCount: () => void;
  lastToast: string | null;
};

const NotificationContext = createContext<NotificationContextType>({
  notificationCount: 0,
  audioEnabled: false,
  toggleAudio: () => {},
  resetCount: () => {},
  lastToast: null,
});

export const useAdminNotifications = () => useContext(NotificationContext);

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // ignore
  }
}

export default function AdminNotificationProvider({ children }: { children: React.ReactNode }) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [lastToast, setLastToast] = useState<string | null>(null);

  const seenIds = useRef(new Set<number>());
  const prevJson = useRef('');
  const firstLoad = useRef(true);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchOrders = useCallback(() => {
    fetch(`${API}/api/room-service/orders`)
      .then((r) => r.json())
      .then((j) => {
        const data = (j.data || []) as Order[];
        const json = JSON.stringify(data);
        if (json === prevJson.current) return;
        prevJson.current = json;

        if (firstLoad.current) {
          firstLoad.current = false;
          for (const o of data) seenIds.current.add(o.id);
          return;
        }

        const newOrders = data.filter((o) => o.status === 'received' && !seenIds.current.has(o.id));
        for (const o of data) seenIds.current.add(o.id);

        if (newOrders.length > 0) {
          setNotificationCount((c) => c + newOrders.length);
          const msg = `Nouvelle commande — Chambre ${newOrders[0].roomNumber}`;
          setLastToast(msg);
          if (audioEnabled) playNotificationSound();
          try { navigator.vibrate?.([200, 100, 200]); } catch {}
          if (toastTimer.current) clearTimeout(toastTimer.current);
          toastTimer.current = setTimeout(() => setLastToast(null), 4000);
        }
      })
      .catch(() => {});
  }, [audioEnabled]);

  useEffect(() => {
    fetchOrders();
    const iv = setInterval(fetchOrders, 5000);
    return () => { clearInterval(iv); if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, [fetchOrders]);

  const toggleAudio = useCallback(() => setAudioEnabled((p) => !p), []);
  const resetCount = useCallback(() => setNotificationCount(0), []);

  return (
    <NotificationContext.Provider value={{ notificationCount, audioEnabled, toggleAudio, resetCount, lastToast }}>
      {children}
    </NotificationContext.Provider>
  );
}
