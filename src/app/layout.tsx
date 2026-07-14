// ============================================================
// Root Layout — خط Baloo 2 الكرتوني
// ============================================================

import type { Metadata } from 'next';
import './globals.css';
import ScrollPositionManager from '@/components/ScrollPositionManager';

export const metadata: Metadata = {
  title: 'بورتفوليو خالد عبدالرحمن',
  description: 'بورتفوليو خالد عبدالرحمن — استعراض الهوية المهنية والمهارات التقنية ومعرض الأعمال',
  keywords: ['portfolio', 'بورتفوليو', 'خالد عبدالرحمن', 'مطور', 'أعمال', 'مهارات'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '1024x1046', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <ScrollPositionManager />
      </body>
    </html>
  );
}
