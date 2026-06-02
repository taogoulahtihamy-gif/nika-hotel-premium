'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import AdminNotificationProvider, { useAdminNotifications } from '@/components/admin/AdminNotificationProvider';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/reservations', label: 'Réservations', icon: '📋' },
  { href: '/admin/rooms', label: 'Chambres', icon: '🏨' },
  { href: '/admin/room-service', label: 'Room Service', icon: '🛎️', notify: true },
  { href: '/admin/qrcodes', label: 'QR Codes', icon: '📱' },
  { href: '/admin/messages', label: 'Messages', icon: '💬' },
  { href: '/admin/gallery', label: 'Galerie', icon: '🖼️' },
];

function AdminLayoutInner({ children, admin, handleLogout }: { children: React.ReactNode; admin: any; handleLogout: () => void }) {
  const pathname = usePathname();
  const { notificationCount, audioEnabled, toggleAudio, resetCount, lastToast } = useAdminNotifications();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#06152f' }}>
      {lastToast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: 'linear-gradient(135deg, #d9a441, #ffe2a0)', color: '#1b1305',
          padding: '14px 24px', borderRadius: 12, fontWeight: 600, fontSize: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease-out',
        }}>
          {lastToast}
        </div>
      )}

      <aside style={{ width: 250, background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 24px', marginBottom: 32 }}>
          <Link href="/" style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', textDecoration: 'none' }}>NIKA HOTEL</Link>
          <div style={{ color: '#d9a441', fontSize: 11, textTransform: 'uppercase', letterSpacing: 3, marginTop: 4 }}>Admin</div>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => { if (item.notify) resetCount(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px',
                color: pathname === item.href ? '#d9a441' : 'rgba(255,255,255,0.6)',
                background: pathname === item.href ? 'rgba(217,164,65,0.08)' : 'transparent',
                borderRight: pathname === item.href ? '3px solid #d9a441' : '3px solid transparent',
                textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'all 0.2s', position: 'relative',
              }}
            >
              <span>{item.icon}</span> {item.label}
              {item.notify && notificationCount > 0 && (
                <span style={{
                  position: 'absolute', right: 16, background: '#ef5350', color: '#fff',
                  borderRadius: 50, padding: '2px 8px', fontSize: 11, fontWeight: 700, lineHeight: '18px',
                }}>
                  {notificationCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => { toggleAudio(); if (!audioEnabled) resetCount(); }} style={{
            background: audioEnabled ? 'rgba(102,187,106,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${audioEnabled ? '#66bb6a' : 'rgba(255,255,255,0.1)'}`,
            color: audioEnabled ? '#66bb6a' : 'rgba(255,255,255,0.5)',
            padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontFamily: "'Jost', sans-serif",
            textAlign: 'center', transition: 'all 0.2s',
          }}>
            {audioEnabled ? '🔊 Son activé' : '🔇 Activer les notifications'}
          </button>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{admin?.email}</div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: 13, padding: 0, textAlign: 'left' }}>Déconnexion</button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>{children}</main>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin';

  useEffect(() => {
    if (isLoginPage) { setLoading(false); return; }
    const stored = sessionStorage.getItem('nika_admin');
    if (stored) { setAdmin(JSON.parse(stored)); setLoading(false); }
    else { router.push('/admin'); }
  }, [pathname]);

  if (loading) return null;
  if (isLoginPage) return <>{children}</>;

  return (
    <AdminNotificationProvider>
      <AdminLayoutInner admin={admin} handleLogout={() => { sessionStorage.removeItem('nika_admin'); router.push('/admin'); }}>
        {children}
      </AdminLayoutInner>
    </AdminNotificationProvider>
  );
}
