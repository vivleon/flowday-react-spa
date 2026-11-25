'use client';

import { startTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { EntryForm } from '@/components/journal/entry-form';
import { SectionHeading } from '@/components/shared/section-heading';
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/state-panel';
import { useEntryDetail } from '@/hooks/use-entry-detail';
import { useAuth, useNotice } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import type { FlowEntryDraft, FlowEntryErrors } from '@/lib/types';
import { emptyDraft, hasErrors, validateEntry } from '@/lib/validation';

export function EntryFormScreen({
  mode,
  id,
}: {
  mode: 'create' | 'edit';
  id?: string;
}) {
  const router = useRouter();
  const { notify } = useNotice();
  const { user } = useAuth();
  const isEdit = mode === 'edit';
  const { entry, loading, error, refresh } = useEntryDetail(isEdit ? id : undefined);
  const [values, setValues] = useState<FlowEntryDraft>(emptyDraft());
  const [errors, setErrors] = useState<FlowEntryErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (entry && isEdit) {
      setValues({
        title: entry.title,
        mood: entry.mood,
        energy: entry.energy,
        focus: entry.focus,
        reflection: entry.reflection,
        wins: entry.wins,
        blockers: entry.blockers,
        next_step: entry.next_step,
        entry_date: entry.entry_date,
      });
    }
  }, [entry, isEdit]);

  const updateField = <K extends keyof FlowEntryDraft>(
    key: K,
    value: FlowEntryDraft[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || (isEdit && (!entry || !id || !user))) return;
    const nextErrors = validateEntry(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      setFormError('필수값과 입력 범위를 확인해 주세요.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const payload = {
      ...values,
      title: values.title.trim(),
      reflection: values.reflection.trim(),
      wins: values.wins.trim(),
      blockers: values.blockers.trim(),
      next_step: values.next_step.trim(),
    };

    const query = isEdit
      ? supabase.from('flow_entries').update(payload).eq('id', id).eq('user_id', user?.id).select('id').maybeSingle()
      : supabase.from('flow_entries').insert(payload).select('id').single();

    const { data, error: requestError } = await query;

    if (requestError || !data) {
      setFormError(requestError ? '저장에 실패했습니다. 잠시 후 다시 시도하세요.' : '이미 삭제되었거나 접근할 수 없는 기록입니다.');
      setSubmitting(false);
      return;
    }

    const targetId = (data as { id: string }).id;

    notify({
      tone: 'success',
      title: isEdit ? '기록이 수정되었습니다.' : '새 기록이 저장되었습니다.',
      description: '상세 화면으로 이동합니다.',
    });

    setSubmitting(false);
    startTransition(() => {
      router.replace(`/entries/${targetId}`);
    });
  };

  return (
    <ProtectedRoute>
      <main className="space-y-6">
        <SectionHeading
          eyebrow={isEdit ? 'Edit Flow' : 'New Flow'}
          title={isEdit ? '기록 다듬기' : '새 몰입 남기기'}
          description="방금 끝낸 집중을 짧게 돌아보세요. 입력하는 동안 오른쪽 카드도 함께 완성됩니다."
        />

        {isEdit && loading ? <LoadingState /> : null}
        {isEdit && !loading && error ? (
          <ErrorState
            title="수정할 기록을 불러오지 못했습니다."
            description={error}
            onRetry={refresh}
          />
        ) : null}
        {isEdit && !loading && !error && !entry && (
          <EmptyState title="수정할 기록이 없습니다." description="기록이 삭제되었거나 볼 수 없는 상태입니다." ctaHref="/entries" ctaLabel="기록 목록으로" />
        )}
        {(!isEdit || (!loading && !error && entry)) && (
          <EntryForm
            values={values}
            errors={errors}
            formError={formError}
            submitting={submitting}
            submitLabel={isEdit ? '수정 저장' : '기록 저장'}
            onChange={updateField}
            onSubmit={handleSubmit}
          />
        )}
      </main>
    </ProtectedRoute>
  );
}
