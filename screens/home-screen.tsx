'use client';

import Link from 'next/link';
import { BookOpen, PencilLine, Search } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

const journalActions = [
  { label: '기록', description: '그날의 감정과 집중도를 남깁니다.', icon: PencilLine },
  { label: '회고', description: '잘한 점과 방해 요소를 돌아보고 다음 행동을 정합니다.', icon: BookOpen },
  { label: '검색', description: '제목·본문이나 감정으로 이전 기록을 찾습니다.', icon: Search },
];

export function HomeScreen() {
  const { user } = useAuth();

  return (
    <main>
      <section className="grid items-center gap-10 rounded-3xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16 lg:p-16">
        <div className="min-w-0">
          <h1 className="max-w-[12em] break-keep text-balance text-[clamp(2.3rem,6vw,4.5rem)] font-semibold leading-[1.13] tracking-tight">
            오늘의 몰입을 가볍게 기록해요.
          </h1>
          <p className="mt-5 max-w-[33rem] break-keep text-base leading-relaxed text-muted-foreground sm:text-lg">
            집중한 순간과 감정을 남기고, 다음에 할 일을 한 문장으로 정리해 보세요.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={user ? '/entries' : '/login'} className={buttonVariants({ size: 'lg', className: 'min-h-11 px-5' })}>
              {user ? '내 기록 보기' : 'Flowday 시작하기'}
            </Link>
            {user && (
              <Link href="/entries/new" className={buttonVariants({ size: 'lg', variant: 'outline', className: 'min-h-11 px-5' })}>
                첫 몰입 기록하기
              </Link>
            )}
          </div>
        </div>

        <dl className="divide-y divide-border border-y border-border">
          {journalActions.map(({ label, description, icon: Icon }) => (
            <div key={label} className="grid gap-1 py-4 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-3">
              <dt className="flex items-center gap-2 font-semibold">
                <Icon aria-hidden="true" className="size-4 text-primary" />
                {label}
              </dt>
              <dd className="text-base leading-relaxed text-muted-foreground">{description}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
