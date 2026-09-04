import { CalendarDays, Forward, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/shared/status-pill';
import type { FlowEntryDraft } from '@/lib/types';

export function EntryPreview({ values }: { values: FlowEntryDraft }) {
  return (
    <Card className="glass-panel border-none">
      <CardContent className="space-y-5 py-1">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
              Live Preview
            </p>
            <h3 className="text-2xl font-semibold">
              {values.title.trim() || '오늘의 로그 제목'}
            </h3>
          </div>
          <StatusPill mood={values.mood} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-secondary/70 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Energy / Focus
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {values.energy} / {values.focus}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary/70 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Entry Date
            </p>
            <p className="mt-2 flex items-center gap-2 text-lg font-medium">
              <CalendarDays className="size-4" />
              {values.entry_date || '날짜 선택'}
            </p>
          </div>
        </div>

        <div className="rounded-[24px] bg-foreground px-5 py-4 text-background">
          <div className="mb-3 flex items-center gap-2 text-sm text-background/70">
            <Sparkles className="size-4" />
            Reflection
          </div>
          <p className="min-h-20 leading-7">
            {values.reflection.trim() || '입력값이 바뀌면 이 미리보기도 즉시 갱신됩니다.'}
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-border p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Forward className="size-4" />
            Next step
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            {values.next_step.trim() || '다음 액션을 적으면 여기에 바로 반영됩니다.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
