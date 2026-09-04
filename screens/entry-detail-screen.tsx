'use client';

import Link from 'next/link';
import { startTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SectionHeading } from '@/components/shared/section-heading';
import { ErrorState, LoadingState } from '@/components/shared/state-panel';
import { StatusPill } from '@/components/shared/status-pill';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEntryDetail } from '@/hooks/use-entry-detail';
import { useNotice } from '@/hooks/use-auth';
import { useEntries } from '@/hooks/use-entries';

export function EntryDetailScreen({ id }: { id: string }) {
  const router = useRouter();
  const { notify } = useNotice();
  const { entry, loading, error, refresh } = useEntryDetail(id);
  const { deleteEntry } = useEntries({ search: '', mood: 'All' });
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!entry) {
      return;
    }

    if (!window.confirm(`"${entry.title}" 기록을 삭제할까요? 삭제 후 복구할 수 없습니다.`)) {
      return;
    }

    setDeleting(true);

    try {
      await deleteEntry(entry.id);
      notify({
        tone: 'success',
        title: '기록이 삭제되었습니다.',
        description: '목록 화면으로 이동합니다.',
      });
      startTransition(() => {
        router.replace('/entries');
      });
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : '삭제에 실패했습니다.';

      notify({
        tone: 'error',
        title: '삭제에 실패했습니다.',
        description: message,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="space-y-6">
        {loading ? <LoadingState /> : null}
        {!loading && error ? (
          <ErrorState
            title="상세 조회에 실패했습니다."
            description={error}
            onRetry={refresh}
          />
        ) : null}
        {!loading && entry ? (
          <>
            <SectionHeading
              eyebrow="Focus Log"
              title={entry.title}
              description="그날의 몰입과 다음 행동을 천천히 다시 살펴보세요."
              action={
                <div className="flex gap-2">
                  <Link
                    href={`/entries/${entry.id}/edit`}
                    className={buttonVariants({ variant: 'outline' })}
                  >
                    <Pencil className="size-4" />
                    수정
                  </Link>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    <Trash2 className="mr-2 size-4" />
                    {deleting ? '삭제 중…' : '삭제'}
                  </Button>
                </div>
              }
            />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <Card className="glass-panel border-none">
                <CardContent className="space-y-6 py-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusPill mood={entry.mood} />
                    <span className="rounded-full bg-secondary px-3 py-1 text-sm">
                      Energy {entry.energy}/5
                    </span>
                    <span className="rounded-full bg-secondary px-3 py-1 text-sm">
                      Focus {entry.focus}/5
                    </span>
                    <span className="rounded-full bg-secondary px-3 py-1 text-sm">
                      {entry.entry_date}
                    </span>
                  </div>

                  <section className="space-y-2">
                    <h2 className="text-lg font-semibold">Reflection</h2>
                    <p className="text-base leading-8 text-muted-foreground">
                      {entry.reflection}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-lg font-semibold">Wins</h2>
                    <p className="text-base leading-8 text-muted-foreground">
                      {entry.wins || '기록 없음'}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-lg font-semibold">Blockers</h2>
                    <p className="text-base leading-8 text-muted-foreground">
                      {entry.blockers || '기록 없음'}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-lg font-semibold">Next Step</h2>
                    <p className="text-base leading-8 text-muted-foreground">
                      {entry.next_step}
                    </p>
                  </section>
                </CardContent>
              </Card>

              <Card className="glass-panel border-none">
                <CardContent className="space-y-4 py-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-primary">
                    이 기록의 흐름
                  </p>
                  <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
                    <li>그날의 감정과 에너지, 집중도를 함께 기록했어요.</li>
                    <li>잘한 점과 방해 요소를 나란히 돌아볼 수 있어요.</li>
                    <li>다음 세션에서 바로 시작할 한 가지 행동을 남겼어요.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </main>
    </ProtectedRoute>
  );
}
