import type { Metadata, Viewport } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const syne = Syne({ subsets: ['latin'], weight: ['600','700','800'], variable: '--font-syne', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300','400','500','600'], variable: '--font-dm-sans', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'SwiftEats — Livraison de repas à Bamako', template: '%s · SwiftEats' },
  description: 'Commandez vos plats préférés auprès des meilleurs restaurants de Bamako.',
};

export const viewport: Viewport = { themeColor: '#C9A84C', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1A1917', color: '#F7F6F2',
              border: '1px solid #3D3B36', borderRadius: '14px',
              fontFamily: 'var(--font-dm-sans)',
            },
          }}
        />
      </body>
    </html>
  );
}
