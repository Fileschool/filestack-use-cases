import type { Metadata } from 'next';
import { Libre_Franklin, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';

const franklin = Libre_Franklin({
  variable: '--font-franklin',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Redfern | Mail & Document Services',
  description:
    'Redfern handles inbound post for businesses that no longer have a post room. Received, routed and indexed the day it arrives.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${franklin.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
