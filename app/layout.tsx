import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Milo · Household intelligence', description: 'Your household consumption companion' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
