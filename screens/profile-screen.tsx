'use client';

import { Flame, Goal, MoonStar, SunMedium, UserRound } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { MetricCard } from '@/components/shared/metric-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/state-panel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth, useTheme } from '@/hooks/use-auth';
import { useEntries } from '@/hooks/use-entries';

export function ProfileScreen() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { entries, loading, error, refresh } = useEntries({
    search: '',
    mood: 'All',
  });

  const averageEnergy = entries.length
    ? (entries.reduce((sum, item) => sum + item.energy, 0) / entries.length).toFixed(1)
    : '0.0';
  const averageFocus = entries.length
    ? (entries.reduce((sum, item) => sum + item.focus, 0) / entries.length).toFixed(1)
    : '0.0';

  return (
    <ProtectedRoute>
      <main className="space-y-6">
        <SectionHeading
          eyebrow="My Rhythm"
          title="나의 흐름"
          description="지금까지 쌓인 몰입과 에너지의 흐름을 한눈에 확인하세요."
        />

        {loading ? <LoadingState /> : null}
        {!loading && error ? (
          <ErrorState
            title="프로필 통계를 불러오지 못했습니다."
            description={error}
            onRetry={refresh}
          />
        ) : null}
        {!loading && !error && !entries.length ? (
          <EmptyState
            title="프로필 통계를 만들 기록이 없습니다."
            description="로그를 하나 저장하면 이 화면의 요약 카드가 즉시 채워집니다."
            ctaHref="/entries/new"
            ctaLabel="첫 로그 작성"
          />
        ) : null}
        {!loading && !error && entries.length ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                label="User"
                value={user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? '오늘의 탐험가'}
                hint={user?.email ?? '체험 계정'}
                icon={<UserRound className="size-5" />}
              />
              <MetricCard
                label="Avg Energy"
                value={averageEnergy}
                hint="전체 로그 평균"
                icon={<Flame className="size-5" />}
              />
              <MetricCard
                label="Avg Focus"
                value={averageFocus}
                hint="전체 로그 평균"
                icon={<Goal className="size-5" />}
              />
            </div>

            <Card className="glass-panel border-none">
              <CardContent className="space-y-4 py-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">최근 다음 행동</h2>
                  <Button type="button" variant="outline" onClick={toggleTheme}>
                    {theme === 'dark' ? <SunMedium /> : <MoonStar />}
                    {theme === 'dark' ? '라이트 모드' : '다크 모드'}
                  </Button>
                </div>
                <div className="grid gap-3">
                  {entries.slice(0, 4).map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl bg-secondary/70 px-4 py-3"
                    >
                      <p className="font-medium">{entry.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {entry.next_step}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </main>
    </ProtectedRoute>
  );
}
