'use client';

import { useState, useRef, useEffect } from 'react';
import { useAdminNotifications } from './AdminNotificationProvider';
import Link from 'next/link';

const typeConfig: Record<string, { icon: string; color: string }> = {
  order_new: { icon: '🛎️', color: '#ffa726' },
  order_status: { icon: '📦', color: '#42a5f5' },
  reservation: { icon: '📋', color: '#66bb6a' },
  message: { icon: '💬', color: '#ef5350' },
  reception_call: { icon: '📞', color: '#ab47bc' },
};

export default function NotificationCenter() {
  const { notifications, notificationCount, markAsRead, markAllAsRead, clearHistory } = useAdminNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, width: 38, height: 38, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', transition: 'all 0.2s',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {notificationCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#ef5350', color: '#fff', borderRadius: '50%',
            width: 18, height: 18, fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(239,83,80,0.4)',
          }}>
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 8,
          width: 360, maxHeight: 480,
          background: 'rgba(6,21,47,0.98)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column', zIndex: 9999,
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: "'Bodoni Moda', serif" }}>
              Notifications
              {notificationCount > 0 && (
                <span style={{ color: '#d9a441', fontWeight: 600, fontSize: 12, marginLeft: 6 }}>
                  ({notificationCount})
                </span>
              )}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {notificationCount > 0 && (
                <button onClick={markAllAsRead} style={{
                  background: 'none', border: 'none', color: '#d9a441', fontSize: 11,
                  cursor: 'pointer', fontFamily: "'Jost', sans-serif", padding: '4px 8px',
                  borderRadius: 6, transition: 'background 0.2s',
                }}>
                  Tout lu
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearHistory} style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11,
                  cursor: 'pointer', fontFamily: "'Jost', sans-serif", padding: '4px 8px',
                  borderRadius: 6, transition: 'background 0.2s',
                }}>
                  Vider
                </button>
              )}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
                Aucune notification
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = typeConfig[n.type] || { icon: '🔔', color: '#fff' };
                const content = (
                  <div
                    key={n.id}
                    onClick={() => { markAsRead(n.id); setOpen(false); }}
                    style={{
                      display: 'flex', gap: 12, padding: '12px 20px', cursor: 'pointer',
                      background: n.read ? 'transparent' : 'rgba(217,164,65,0.04)',
                      transition: 'background 0.2s', alignItems: 'flex-start',
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                    }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{cfg.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          color: n.read ? 'rgba(255,255,255,0.4)' : '#fff',
                          fontSize: 13, fontWeight: n.read ? 400 : 600,
                        }}>
                          {n.title}
                        </span>
                        {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d9a441', flexShrink: 0 }} />}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2, lineHeight: 1.4 }}>
                        {n.message}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, marginTop: 4 }}>
                        {new Date(n.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
                if (n.link) {
                  return <Link key={n.id} href={n.link} style={{ textDecoration: 'none', display: 'block' }}>{content}</Link>;
                }
                return content;
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
