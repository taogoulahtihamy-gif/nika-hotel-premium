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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

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

      {/* Mobile header */}
      <div className="admin-mobile-header">
        <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff' }}>NIKA</span>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar overlay */}
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

      <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
        <div style={{ padding: '28px 24px 24px' }}>
          <Link href="/" style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Bodoni Moda', serif", color: '#fff', textDecoration: 'none' }}>NIKA HOTEL</Link>
          <div style={{ color: '#d9a441', fontSize: 11, textTransform: 'uppercase', letterSpacing: 3, marginTop: 4 }}>Admin Panel</div>
        </div>
        <nav style={{ flex: 1, padding: '0 12px' }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => { if (item.notify) resetCount(); }}
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.notify && notificationCount > 0 && (
                <span className="nav-badge">{notificationCount}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => { toggleAudio(); if (!audioEnabled) resetCount(); }} className={`audio-btn ${audioEnabled ? 'on' : ''}`}>
            {audioEnabled ? '🔊 Son activé' : '🔇 Notifications'}
          </button>
          <div className="admin-email">{admin?.email}</div>
          <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
        </div>
      </aside>

      <main className="admin-main">{children}</main>

      <style>{`
        .admin-mobile-header {
          display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(6,21,47,0.98); backdrop-filter: blur(20px);
          padding: 12px 20px; justify-content: space-between; align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sidebar-overlay {
          display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          z-index: 90;
        }
        .admin-sidebar {
          width: 250px; background: rgba(255,255,255,0.03); border-right: 1px solid rgba(255,255,255,0.06);
          padding: 0; display: flex; flex-direction: column; transition: transform 0.3s;
          position: sticky; top: 0; height: 100vh;
        }
        .nav-link {
          display: flex; align-items: center; gap: 12px; padding: 13px 16px; margin-bottom: 2px;
          color: rgba(255,255,255,0.55); border-radius: 12px;
          text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.2s; position: relative;
        }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .nav-link.active { color: #d9a441; background: rgba(217,164,65,0.08); font-weight: 600; }
        .nav-icon { font-size: 16px; width: 24px; text-align: center; }
        .nav-badge {
          position: absolute; right: 12px; background: #ef5350; color: #fff;
          border-radius: 999px; padding: 1px 8px; font-size: 11px; font-weight: 700; line-height: 18px; min-width: 20px; text-align: center;
        }
        .sidebar-footer {
          padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; gap: 8px;
        }
        .audio-btn {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.45); padding: 8px 14px; border-radius: 999px;
          cursor: pointer; font-size: 12px; font-family: 'Jost', sans-serif; text-align: center;
          transition: all 0.2s;
        }
        .audio-btn.on { background: rgba(102,187,106,0.12); border-color: #66bb6a; color: #66bb6a; }
        .admin-email { color: rgba(255,255,255,0.3); font-size: 11px; text-align: center; }
        .logout-btn { background: none; border: none; color: #ef5350; cursor: pointer; font-size: 13px; font-family: 'Jost', sans-serif; text-align: center; padding: 4px; }
        .admin-main { flex: 1; padding: 32px; overflow: auto; min-height: 100vh; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .premium-scroll::-webkit-scrollbar { width: 6px; }
        .premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .premium-scroll::-webkit-scrollbar-thumb { background: rgba(217,164,65,0.3); border-radius: 999px; }

        @media (max-width: 768px) {
          .admin-mobile-header { display: flex; }
          .admin-sidebar {
            position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
            transform: translateX(-100%); height: 100vh;
          }
          .admin-sidebar.open { transform: translateX(0); }
          .sidebar-overlay { display: block; }
          .admin-main { padding: 72px 16px 24px; }
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
