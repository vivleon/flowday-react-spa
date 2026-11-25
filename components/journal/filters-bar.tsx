import type { CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Liquid } from 'liquid-gooey';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOOD_OPTIONS, type Mood } from '@/lib/types';
const filterMoods = ['All', ...MOOD_OPTIONS] as const;

export function FiltersBar({
  search,
  onSearchChange,
  mood,
  onMoodChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  mood: Mood | 'All';
  onMoodChange: (value: Mood | 'All') => void;
}) {
  const reducedMotion = useReducedMotion();
  const selectedIndex = filterMoods.indexOf(mood);

  return (
    <div className="glass-panel flex flex-col gap-4 border-none p-4">
      <label htmlFor="entry-search" className="relative block">
        <span className="sr-only">기록 검색</span>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="entry-search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-11 rounded-full pl-10"
          placeholder="기록 제목, reflection, next step 검색"
        />
      </label>

      <fieldset className="relative isolate grid min-w-0 grid-cols-3 gap-y-2 pb-2 sm:grid-cols-6">
        <legend className="sr-only">감정 필터</legend>
        {reducedMotion === false && (
          <div className="flow-mood-liquid" aria-hidden="true" style={{ '--mood-index': selectedIndex } as CSSProperties}>
            <Liquid fill="var(--primary)" blur={2} contrast={16} filterPadding={12} className="h-full">
              <Liquid.Item effect="move" move={{ springiness: 0.85, wobble: 0, stretch: 0.12, trail: 0.18 }} radius={3}>
                <div className="flow-mood-indicator" />
              </Liquid.Item>
            </Liquid>
          </div>
        )}
        {filterMoods.map((item) => (
          <Button
            key={item}
            type="button"
            aria-pressed={mood === item}
            variant={mood === item ? 'secondary' : 'ghost'}
            className="z-10 mx-0.5 min-h-11 min-w-0 rounded-lg px-1"
            onClick={() => onMoodChange(item)}
          >
            {item}
          </Button>
        ))}
      </fieldset>
    </div>
  );
}
