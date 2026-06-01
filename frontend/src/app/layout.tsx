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
  title: 'NIKA HOTEL — Luxury Hotel Restaurant Bar',
  description: 'Site premium officiel NIKA HOTEL : hébergement, restaurant, bar et réservation.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bodoni.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
