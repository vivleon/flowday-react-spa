'use client';

import Link from 'next/link';
import { startTransition, useEffect, type PropsWithChildren } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { LoadingState } from '@/components/shared/state-panel';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const safePathname = pathname ?? '/entries';
  const { loading, user } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      startTransition(() => {
        router.replace(`/login?next=${encodeURIComponent(safePathname)}`);
      });
    }
  }, [loading, router, safePathname, user]);

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return (
      <div className="glass-panel flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 className="text-2xl font-semibold">로그인이 필요한 페이지입니다.</h2>
        <p className="max-w-md text-muted-foreground">
          내 몰입 기록은 로그인 후 확인할 수 있습니다.
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(safePathname)}`}
          className={buttonVariants({})}
        >
          로그인으로 이동
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
