import type { Metadata } from 'next';
import { Fraunces, Karla } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
});

const karla = Karla({
  variable: '--font-karla',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Saltmarket | Secondhand, sold well',
  description:
    'Saltmarket is a marketplace for furniture, homeware and vintage finds. List in a minute, from the photo you already took.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${karla.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
