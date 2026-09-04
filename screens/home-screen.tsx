'use client';

import Link from 'next/link';
import { ArrowRight, Flame, Layers3, Sparkles } from 'lucide-react';
import { MetricCard } from '@/components/shared/metric-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { buttonVariants } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export function HomeScreen() {
  const { user } = useAuth();

  return (
    <main className="space-y-6">
      <section className="glass-panel overflow-hidden border-none p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Today, one good flow"
              title="오늘의 몰입을 가볍게 기록해요."
              description="집중한 순간과 감정을 남기고, 작은 성취가 쌓이는 나만의 리듬을 확인하세요."
              action={
                <Link
                  href={user ? '/entries' : '/login'}
                  className={buttonVariants({ size: 'lg', className: 'rounded-full' })}
                >
                  {user ? '내 기록 보기' : 'Flowday 시작하기'}
                </Link>
              }
            />

            <div className="grid gap-4 md:grid-cols-2">
              <MetricCard
                label="한 주의 리듬"
                value="7 days"
                hint="매일의 몰입을 한곳에"
                icon={<Layers3 className="size-5" />}
              />
              <MetricCard
                label="작은 시작"
                value="25 min"
                hint="부담 없이 한 세션부터"
                icon={<Flame className="size-5" />}
              />
            </div>
          </div>

          <div className="glass-panel border-none bg-foreground p-6 text-background">
            <p className="text-xs uppercase tracking-[0.26em] text-background/60">
              Your flow, clearly
            </p>
            <div className="mt-6 space-y-4">
              {[
                '오늘의 집중과 감정을 짧게 남겨요.',
                '잘한 일과 방해 요소를 함께 돌아봐요.',
                '다음 행동을 한 문장으로 정리해요.',
                '검색과 필터로 나만의 패턴을 발견해요.',
              ].map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  style={{ transform: `translateX(${index * 8}px)` }}
                >
                  <p className="flex items-center gap-2 text-sm leading-7">
                    <Sparkles className="size-4 text-accent" />
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href={user ? '/entries/new' : '/login'}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium"
            >
              첫 몰입 기록하기
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
