import { Bodoni_Moda, Jost } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NIKA HOTEL — Luxury Hotel Restaurant Bar à Bujumbura',
    template: '%s | NIKA HOTEL',
  },
  description: 'Site premium officiel NIKA HOTEL : hébergement de luxe, restaurant raffiné, bar lounge à Bujumbura, Burundi. Réservez votre séjour en ligne.',
  keywords: ['hôtel Bujumbura', 'hôtel Burundi', 'NIKA HOTEL', 'hébergement luxe', 'restaurant Bujumbura', 'bar lounge', 'réservation hôtel'],
  authors: [{ name: 'NIKA HOTEL' }],
  creator: 'NIKA HOTEL',
  publisher: 'NIKA HOTEL',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nikahotel.com'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'NIKA HOTEL',
    title: 'NIKA HOTEL — Luxury Hotel Restaurant Bar',
    description: 'Hébergement de luxe, restaurant raffiné et bar lounge à Bujumbura, Burundi.',
    url: '/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NIKA HOTEL' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NIKA HOTEL — Luxury Hotel Restaurant Bar',
    description: 'Hébergement de luxe, restaurant raffiné et bar lounge à Bujumbura, Burundi.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  other: {
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bodoni.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
