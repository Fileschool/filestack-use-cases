import type { Metadata } from 'next';
import { Instrument_Serif, Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';

const instrument = Instrument_Serif({
  variable: '--font-instrument',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Marlow | Spend & Expense Management',
  description:
    'Marlow gives finance teams every receipt, coded and checked, without chasing anybody. Snap it and it is done.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${instrument.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
