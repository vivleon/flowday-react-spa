'use client';

import type { PropsWithChildren } from 'react';
import { SiteShell } from '@/components/layout/site-shell';
import { NotificationCenter } from '@/components/shared/notification-center';
import { AppContextProvider } from '@/lib/app-context';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AppContextProvider>
      <SiteShell>{children}</SiteShell>
      <NotificationCenter />
    </AppContextProvider>
  );
}
