'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import { BarChart3, Flame, Plus, Target } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { EntryList } from '@/components/journal/entry-list';
import { FiltersBar } from '@/components/journal/filters-bar';
import { MetricCard } from '@/components/shared/metric-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/state-panel';
import { buttonVariants } from '@/components/ui/button';
import { useEntries } from '@/hooks/use-entries';
import { type Mood } from '@/lib/types';

export function EntriesScreen() {
  const [search, setSearch] = useState('');
  const [mood, setMood] = useState<Mood | 'All'>('All');
  const deferredSearch = useDeferredValue(search);
  const { entries, filteredEntries, loading, error, refresh } = useEntries({
    search: deferredSearch,
    mood,
  });

  const stats = useMemo(() => {
    if (!entries.length) {
      return {
        averageEnergy: '0.0',
        averageFocus: '0.0',
        count: '0',
      };
    }

    const totalEnergy = entries.reduce((sum, item) => sum + item.energy, 0);
    const totalFocus = entries.reduce((sum, item) => sum + item.focus, 0);

    return {
      averageEnergy: (totalEnergy / entries.length).toFixed(1),
      averageFocus: (totalFocus / entries.length).toFixed(1),
      count: String(entries.length),
    };
  }, [entries]);

  return (
    <ProtectedRoute>
      <main className="space-y-6">
        <SectionHeading
          eyebrow="My Flow"
          title="몰입 기록"
          description="날짜별 기록을 검색하고 감정으로 분류해, 내가 집중하는 방식의 변화를 살펴보세요."
          action={
            <Link
              href="/entries/new"
              className={buttonVariants({ size: 'lg', className: 'rounded-full' })}
            >
              <Plus className="size-4" />
              새 로그
            </Link>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Entries"
            value={stats.count}
            hint="원격 DB에 저장된 내 기록 수"
            icon={<BarChart3 className="size-5" />}
          />
          <MetricCard
            label="Avg Energy"
            value={stats.averageEnergy}
            hint="기록 전체 평균"
            icon={<Flame className="size-5" />}
          />
          <MetricCard
            label="Avg Focus"
            value={stats.averageFocus}
            hint="필터 전 전체 평균"
            icon={<Target className="size-5" />}
          />
        </div>

        <FiltersBar
          search={search}
          onSearchChange={setSearch}
          mood={mood}
          onMoodChange={setMood}
        />

        {loading ? <LoadingState /> : null}
        {!loading && error ? (
          <ErrorState
            title="목록 조회에 실패했습니다."
            description={error}
            onRetry={refresh}
          />
        ) : null}
        {!loading && !error && !filteredEntries.length ? (
          <EmptyState
            title="표시할 데이터가 없습니다."
            description="아직 기록이 없거나 현재 필터에 맞는 항목이 없습니다."
            ctaHref="/entries/new"
            ctaLabel="첫 로그 만들기"
          />
        ) : null}
        {!loading && !error && filteredEntries.length ? (
          <EntryList entries={filteredEntries} />
        ) : null}
      </main>
    </ProtectedRoute>
  );
}
