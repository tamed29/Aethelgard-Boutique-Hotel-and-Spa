import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import ClientProviders from '@/components/ui/ClientProviders';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import PageLoader from '@/components/ui/PageLoader';
import RadiantConcierge from '@/components/ui/RadiantConcierge';
import MaintenanceOverlay from '@/components/ui/MaintenanceOverlay';
import LenisProvider from '@/components/providers/LenisProvider';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Aethelgard Boutique Hotel & Spa | A Narrative Wychwood Experience',
    template: '%s | Aethelgard Boutique Hotel & Spa'
  },
  description: 'Immerse yourself in a high-emotion narrative journey at Aethelgard. Discover exclusive, cozy relaxation beneath the ancient oaks of Wychwood Forest.',
  keywords: ['boutique hotel', 'luxury spa', 'narrative experience', 'Wychwood Forest', 'Cotswolds luxury', 'Aethelgard'],
  icons: {
    icon: [
      {
        url: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'><rect width='60' height='60' rx='12' fill='%233D4127'/><path d='M30 8L14 47H19.5L30 20L40.5 47H46L30 8Z' fill='%23BAC095'/><path d='M21 36H39' stroke='%23BAC095' stroke-width='2.5' stroke-linecap='round'/><path d='M44 44C49 39 49 29 39 24C34 21 24 24 19 29C14 34 14 44 24 44' stroke='%23BAC095' stroke-width='1.5' stroke-linecap='round' fill='none'/><path d='M41 31C43 29 43 25 40 23C37 21 33 23 32 26C31 29 33 33 37 34C41 35 44 31 41 31Z' fill='%23BAC095' fill-opacity='0.4'/><circle cx='30' cy='8' r='2' fill='%23BAC095'/></svg>`,
        type: 'image/svg+xml',
      },
    ],
    apple: '/images/hotel/h2.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen relative font-sans">
        <NextTopLoader color="#D4DE95" showSpinner={false} />
        <PageLoader />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
