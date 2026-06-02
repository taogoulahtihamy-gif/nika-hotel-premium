'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type NotificationItem = {
  id: string;
  type: 'order_new' | 'order_status' | 'reservation' | 'message' | 'reception_call';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  link?: string;
};

type Order = {
  id: number;
  orderNumber: string;
  roomNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type NotificationContextType = {
  notifications: NotificationItem[];
  notificationCount: number;
  audioEnabled: boolean;
  toggleAudio: () => void;
  resetCount: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearHistory: () => void;
  lastToast: { message: string; type: 'order' | 'info' | 'warning' } | null;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  notificationCount: 0,
  audioEnabled: false,
  toggleAudio: () => {},
  resetCount: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearHistory: () => {},
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
  } catch {}
}

function addNotification(
  list: NotificationItem[],
  item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>
): NotificationItem[] {
  const id = `${item.type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  return [{ ...item, id, timestamp: Date.now(), read: false }, ...list].slice(0, 100);
}

export default function AdminNotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [lastToast, setLastToast] = useState<NotificationContextType['lastToast']>(null);

  const ordersRef = useRef<Order[]>([]);
  const prevOrdersJson = useRef('');
  const firstLoad = useRef(true);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: 'order' | 'info' | 'warning') => {
    setLastToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setLastToast(null), 4000);
  }, []);

  const notify = useCallback((item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    setNotifications((prev) => addNotification(prev, item));
    showToast(item.message, item.type === 'order_new' ? 'order' : 'info');
    if (audioEnabled) playNotificationSound();
    try { navigator.vibrate?.([200, 100, 200]); } catch {}
  }, [audioEnabled, showToast]);

  const fetchOrders = useCallback(() => {
    fetch(`${API}/api/room-service/orders`)
      .then((r) => r.json())
      .then((j) => {
        const data = (j.data || []) as Order[];
        const json = JSON.stringify(data.map((o) => `${o.id}:${o.status}`));
        if (json === prevOrdersJson.current) return;
        prevOrdersJson.current = json;

        if (firstLoad.current) {
          firstLoad.current = false;
          ordersRef.current = data;
          return;
        }

        const prev = ordersRef.current;
        ordersRef.current = data;

        const prevMap = new Map(prev.map((o) => [o.id, o]));
        for (const order of data) {
          const prevOrder = prevMap.get(order.id);
          if (!prevOrder) {
            if (order.status === 'received') {
              notify({
                type: 'order_new',
                title: 'Nouvelle commande',
                message: `Chambre ${order.roomNumber} — ${order.orderNumber}`,
                link: '/admin/room-service',
              });
            }
          } else if (prevOrder.status !== order.status) {
            notify({
              type: 'order_status',
              title: 'Changement de statut',
              message: `Chambre ${order.roomNumber} — ${order.orderNumber} : ${order.status}`,
              link: '/admin/room-service',
            });
          }
        }
      })
      .catch(() => {});
  }, [notify]);

  useEffect(() => {
    fetchOrders();
    const iv = setInterval(fetchOrders, 5000);
    return () => { clearInterval(iv); if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, [fetchOrders]);

  const toggleAudio = useCallback(() => setAudioEnabled((p) => !p), []);
  const resetCount = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);
  const clearHistory = useCallback(() => {
    setNotifications([]);
  }, []);

  const notificationCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications, notificationCount, audioEnabled, toggleAudio, resetCount,
      markAsRead, markAllAsRead, clearHistory, lastToast,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
