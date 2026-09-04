import type { Metadata } from 'next';
import { AppProviders } from '@/components/providers/app-providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'Flowday · 오늘의 몰입 기록',
  description: '집중과 감정의 흐름을 기록하고 작은 성취를 이어가는 React 플로우 저널',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
