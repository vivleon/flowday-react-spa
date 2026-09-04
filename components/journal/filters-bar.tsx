import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOOD_OPTIONS, type Mood } from '@/lib/types';
import { cn } from '@/lib/utils';

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
  return (
    <div className="glass-panel flex flex-col gap-4 border-none p-4">
      <label htmlFor="entry-search" className="relative block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="entry-search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-11 rounded-full pl-10"
          placeholder="기록 제목, reflection, next step 검색"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {(['All', ...MOOD_OPTIONS] as const).map((item) => (
          <Button
            key={item}
            type="button"
            variant={mood === item ? 'default' : 'outline'}
            className={cn('rounded-full')}
            onClick={() => onMoodChange(item)}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
}
