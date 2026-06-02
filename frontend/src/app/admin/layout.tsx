'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/reservations', label: 'Réservations', icon: '📋' },
  { href: '/admin/rooms', label: 'Chambres', icon: '🏨' },
  { href: '/admin/room-service', label: 'Room Service', icon: '🛎️' },
  { href: '/admin/qrcodes', label: 'QR Codes', icon: '📱' },
  { href: '/admin/messages', label: 'Messages', icon: '💬' },
  { href: '/admin/gallery', label: 'Galerie', icon: '🖼️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    const stored = sessionStorage.getItem('nika_admin');
    if (stored) {
      setAdmin(JSON.parse(stored));
      setLoading(false);
    } else {
      router.push('/admin');
    }
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('nika_admin');
    router.push('/admin');
  };

  if (loading) return null;

  if (isLoginPage) return <>{children}</>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#06152f' }}>
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
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px',
                color: pathname === item.href ? '#d9a441' : 'rgba(255,255,255,0.6)',
                background: pathname === item.href ? 'rgba(217,164,65,0.08)' : 'transparent',
                borderRight: pathname === item.href ? '3px solid #d9a441' : '3px solid transparent',
                textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
              }}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{admin?.email}</div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: 13, padding: 0, marginTop: 4 }}>Déconnexion</button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>{children}</main>
    </div>
  );
}
