import { memo } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Flame, Target } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { StatusPill } from '@/components/shared/status-pill';
import type { FlowEntry } from '@/lib/types';

function EntryCardComponent({ entry }: { entry: FlowEntry }) {
  return (
    <Card className="glass-panel h-full border-none">
      <CardContent className="space-y-4 py-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {entry.entry_date}
            </p>
            <h3 className="mt-2 text-xl font-semibold">{entry.title}</h3>
          </div>
          <StatusPill mood={entry.mood} />
        </div>

        <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
          {entry.reflection}
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-secondary/70 p-3 text-sm">
            <p className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Flame className="size-4" />
              Energy
            </p>
            <p className="text-lg font-semibold">{entry.energy}/5</p>
          </div>
          <div className="rounded-2xl bg-secondary/70 p-3 text-sm">
            <p className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Target className="size-4" />
              Focus
            </p>
            <p className="text-lg font-semibold">{entry.focus}/5</p>
          </div>
          <div className="rounded-2xl bg-secondary/70 p-3 text-sm">
            <p className="mb-2 flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4" />
              Updated
            </p>
            <p className="text-lg font-semibold">
              {entry.updated_at.slice(0, 10)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <p className="text-sm text-muted-foreground">
          {entry.next_step.slice(0, 48)}
          {entry.next_step.length > 48 ? '…' : ''}
        </p>
        <Link
          href={`/entries/${entry.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium"
        >
          자세히 보기
          <ArrowRight className="size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export const EntryCard = memo(EntryCardComponent);
