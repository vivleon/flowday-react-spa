'use client';

import type { PropsWithChildren } from 'react';
import { MainNav } from '@/components/layout/main-nav';
import { PageTransition } from '@/components/layout/page-transition';
import { useWebMcp } from '@/hooks/use-webmcp';

export function SiteShell({ children }: PropsWithChildren) {
  useWebMcp();

  return (
    <div className="app-shell">
      <MainNav />
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
