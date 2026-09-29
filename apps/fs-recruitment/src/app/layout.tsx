import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Hollis | Talent Operations',
  description:
    'Hollis is the applicant tracking system for teams that hire carefully. Every application screened, searchable and safe to open.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
