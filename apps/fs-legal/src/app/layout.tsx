import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Pemberton Hale | Solicitors & Advisors',
  description:
    'Pemberton Hale advises private clients and owner-managed businesses. Documents exchanged through our client room, never by email.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
