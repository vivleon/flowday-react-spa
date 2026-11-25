'use client';

import type { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isBrowseRoute = pathname === '/' || pathname === '/entries' ||
    (pathname !== '/entries/new' && /^\/entries\/[^/]+$/.test(pathname ?? ''));

  if (!isBrowseRoute) return <>{children}</>;

  return <div key={pathname} className="flow-route-entry">{children}</div>;
}
