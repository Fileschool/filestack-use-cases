import type { Metadata } from 'next';
import { Source_Serif_4, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';

const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Ardmore Mutual | Insurance since 1923',
  description:
    'Ardmore Mutual insures homes and small businesses. Report a claim in minutes and speak to a person, not a queue.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
