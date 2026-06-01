'use client';

import { hotel } from '@/data/site';

const socialLinks = [
  { label: 'Instagram', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', extra: 'M17.5 6.5h.01', hasRect: true },
  { label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { label: 'Twitter', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <div className="footerGrid">
          <div className="footerCard">
            <h3>NIKA HOTEL</h3>
            <p>{hotel.tagline}</p>
            <p>{hotel.location}</p>
          </div>
          <div className="footerCard">
            <h3>Contacts</h3>
            <p>
              <a href={`tel:${hotel.phone1}`} style={{ color: 'inherit' }}>{hotel.phone1}</a>
              <br />
              <a href={`tel:${hotel.phone2}`} style={{ color: 'inherit' }}>{hotel.phone2}</a>
            </p>
            <p>
              <a href={`https://wa.me/${hotel.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                WhatsApp: +257 77 482 817
              </a>
            </p>
            <p>{hotel.email}</p>
          </div>
          <div className="footerCard">
            <h3>Services</h3>
            <p>Hébergement<br/>Restaurant<br/>Bar & Lounge</p>
          </div>
        </div>

        <div className="bottom">
          <span>&copy; {new Date().getFullYear()} NIKA HOTEL — Bujumbura, Burundi.</span>
          <div className="social-links">
            {socialLinks.map((s) => (
              <a key={s.label} href="#" aria-label={s.label}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {s.hasRect && <rect x="2" y="2" width="20" height="20" rx="5"/>}
                  <path d={s.path} />
                  {s.extra && <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
