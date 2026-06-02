'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAdminNotifications } from './AdminNotificationProvider';
import Link from 'next/link';

const typeConfig: Record<string, { icon: string; color: string }> = {
  order_new: { icon: '🛎️', color: '#ffa726' },
  order_status: { icon: '📦', color: '#42a5f5' },
  reservation: { icon: '📋', color: '#66bb6a' },
  message: { icon: '💬', color: '#ef5350' },
  reception_call: { icon: '📞', color: '#ab47bc' },
};

function NotificationPanel({
  notifications,
  notificationCount,
  onClose,
  onMarkAllRead,
  onClear,
  onMarkRead,
  style,
  isMobile,
}: {
  notifications: any[];
  notificationCount: number;
  onClose: () => void;
  onMarkAllRead: () => void;
  onClear: () => void;
  onMarkRead: (id: string) => void;
  style: React.CSSProperties;
  isMobile: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const inner = (
    <div ref={panelRef} style={{
      ...style,
      background: 'rgba(6,21,47,0.98)', backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 20, boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column', zIndex: 9999,
      overflow: 'hidden',
      animation: 'notifPanelIn 200ms ease-out',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 22px 10px',
      }}>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: "'Bodoni Moda', serif", letterSpacing: '0.02em' }}>
            Notifications
            {notificationCount > 0 && (
              <span style={{ color: '#d9a441', fontWeight: 600, fontSize: 12, marginLeft: 6 }}>
                ({notificationCount})
              </span>
            )}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>
            Historique des événements
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {notificationCount > 0 && (
            <button onClick={onMarkAllRead} style={{
              background: 'rgba(217,164,65,0.1)', border: '1px solid rgba(217,164,65,0.2)',
              color: '#d9a441', fontSize: 11, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Jost', sans-serif", padding: '5px 14px',
              borderRadius: 999, whiteSpace: 'nowrap',
            }}>
              Tout lu
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={onClear} style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.35)', fontSize: 11,
              cursor: 'pointer', fontFamily: "'Jost', sans-serif", padding: '5px 14px',
              borderRadius: 999, whiteSpace: 'nowrap',
            }}>
              Vider
            </button>
          )}
        </div>
      </div>

      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '0 22px 4px',
      }} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0 8px' }}>
        {notifications.length === 0 ? (
          <div style={{
            padding: '40px 22px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 28, opacity: 0.25 }}>🔔</span>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Aucune notification</span>
          </div>
        ) : (
          notifications.map((n) => {
            const cfg = typeConfig[n.type] || { icon: '🔔', color: '#fff' };
            const card = (
              <div
                key={n.id}
                onClick={() => { onMarkRead(n.id); if (!n.link) onClose(); }}
                style={{
                  display: 'flex', gap: 12, padding: '12px 22px', cursor: 'pointer',
                  background: n.read ? 'transparent' : 'rgba(217,164,65,0.04)',
                  transition: 'background 0.2s', alignItems: 'flex-start',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                }}
              >
                <span style={{ fontSize: isMobile ? 18 : 16, flexShrink: 0, marginTop: 2 }}>{cfg.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      color: n.read ? 'rgba(255,255,255,0.4)' : '#fff',
                      fontSize: isMobile ? 14 : 13, fontWeight: n.read ? 400 : 600,
                    }}>
                      {n.title}
                    </span>
                    {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d9a441', flexShrink: 0 }} />}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: isMobile ? 13 : 12, marginTop: 2, lineHeight: 1.4 }}>
                    {n.message}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: isMobile ? 11 : 10, marginTop: 4 }}>
                    {new Date(n.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
            if (n.link) {
              return (
                <Link key={n.id} href={n.link} style={{ textDecoration: 'none', display: 'block' }} onClick={() => onClose()}>
                  {card}
                </Link>
              );
            }
            return card;
          })
        )}
      </div>
    </div>
  );

  if (isMobile) return inner;

  return createPortal(inner, document.body);
}

export default function NotificationCenter() {
  const { notifications, notificationCount, markAsRead, markAllAsRead, clearHistory } = useAdminNotifications();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 16 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const toggle = useCallback(() => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    setOpen((p) => !p);
  }, [open]);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleMarkAllRead = useCallback(() => { markAllAsRead(); }, [markAllAsRead]);
  const handleClear = useCallback(() => { clearHistory(); }, [clearHistory]);
  const handleMarkRead = useCallback((id: string) => { markAsRead(id); }, [markAsRead]);

  const isMobile = mounted && window.innerWidth < 768;

  return (
    <>
      <button ref={btnRef} onClick={toggle} style={{
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, width: 38, height: 38, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', transition: 'all 0.2s', flexShrink: 0,
      }}>
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

      {open && !isMobile && mounted && (
        <>
          <NotificationPanel
            notifications={notifications}
            notificationCount={notificationCount}
            onClose={handleClose}
            onMarkAllRead={handleMarkAllRead}
            onClear={handleClear}
            onMarkRead={handleMarkRead}
            isMobile={false}
            style={{
              position: 'fixed', top: pos.top, right: pos.right,
              width: 380, maxHeight: 500,
            }}
          />
        </>
      )}

      {open && isMobile && mounted && (
        <>
          <div
            onClick={handleClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998, animation: 'notifPanelIn 150ms ease-out' }}
          />
          <NotificationPanel
            notifications={notifications}
            notificationCount={notificationCount}
            onClose={handleClose}
            onMarkAllRead={handleMarkAllRead}
            onClear={handleClear}
            onMarkRead={handleMarkRead}
            isMobile={true}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              maxHeight: '75vh', borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
              animation: 'notifSlideUp 250ms cubic-bezier(0.68,-0.55,0.265,1.55)',
            }}
          />
        </>
      )}

      <style>{`
        @keyframes notifPanelIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes notifSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
