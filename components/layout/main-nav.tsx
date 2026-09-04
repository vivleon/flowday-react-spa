'use client';

import Link from 'next/link';
import { MoonStar, Sparkles, SunMedium } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { useAuth, useTheme } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: '홈' },
  { href: '/entries', label: '기록' },
  { href: '/entries/new', label: '새 기록' },
  { href: '/profile', label: '프로필' },
];

function isActiveRoute(href: string, pathname: string) {
  if (href === '/') return pathname === '/';
  if (href === '/entries/new') return pathname === '/entries/new';
  if (href === '/entries') {
    return pathname.startsWith('/entries') && pathname !== '/entries/new';
  }
  return pathname === href;
}

export function MainNav() {
  const pathname = usePathname();
  const currentPath = pathname ?? '/';
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass-panel sticky top-4 z-30 mb-6 flex flex-wrap items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
          <Sparkles className="size-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Flowday
          </p>
          <p className="text-sm font-medium">오늘의 몰입 저널</p>
        </div>
      </div>

      <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto border-t border-border/70 pt-3 md:order-none md:w-auto md:border-0 md:pt-0" aria-label="주요 메뉴">
        {navItems.map((item) => {
          const active = isActiveRoute(item.href, currentPath);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm text-muted-foreground',
                active && 'bg-secondary text-foreground',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <SunMedium className="size-4" />
          ) : (
            <MoonStar className="size-4" />
          )}
        </Button>
        <Link href={user ? '/profile' : '/login'} className={buttonVariants({})}>
          {user ? '내 계정' : '로그인'}
        </Link>
      </div>
    </header>
  );
}
