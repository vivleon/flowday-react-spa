'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { EntryPreview } from '@/components/journal/entry-preview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { MOOD_OPTIONS, type FlowEntryDraft, type FlowEntryErrors } from '@/lib/types';

export function EntryForm({
  values,
  errors,
  formError,
  submitting,
  submitLabel,
  onChange,
  onSubmit,
}: {
  values: FlowEntryDraft;
  errors: FlowEntryErrors;
  formError: string | null;
  submitting: boolean;
  submitLabel: string;
  onChange: <K extends keyof FlowEntryDraft>(
    key: K,
    value: FlowEntryDraft[K],
  ) => void;
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <form className="glass-panel border-none p-6" onSubmit={onSubmit}>
        <div className="grid gap-5">
          {formError ? (
            <Alert variant="destructive">
              <AlertTitle>제출에 실패했습니다.</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}

          <Field>
            <FieldLabel htmlFor="entry-title">기록 제목</FieldLabel>
            <FieldContent>
              <Input
                id="entry-title"
                value={values.title}
                onChange={(event) => onChange('title', event.target.value)}
                minLength={2}
                maxLength={80}
                aria-invalid={Boolean(errors.title)}
                placeholder="예: Launch day 집중 루틴"
              />
              <FieldDescription>카드와 상세 페이지 상단에 표시됩니다.</FieldDescription>
              <FieldError>{errors.title}</FieldError>
            </FieldContent>
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="entry-mood">오늘의 감정</FieldLabel>
              <FieldContent>
                <select
                  id="entry-mood"
                  value={values.mood}
                  onChange={(event) =>
                    onChange('mood', event.target.value as FlowEntryDraft['mood'])
                  }
                  className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-invalid={Boolean(errors.mood)}
                >
                  {MOOD_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <FieldError>{errors.mood}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="entry-energy">에너지 · {values.energy}/5</FieldLabel>
              <FieldContent>
                <input
                  id="entry-energy"
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={values.energy}
                  onChange={(event) =>
                    onChange('energy', Number(event.target.value))
                  }
                  aria-label="에너지"
                  className="h-11 w-full accent-primary"
                />
                <FieldError>{errors.energy}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="entry-focus">집중도 · {values.focus}/5</FieldLabel>
              <FieldContent>
                <input
                  id="entry-focus"
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={values.focus}
                  onChange={(event) =>
                    onChange('focus', Number(event.target.value))
                  }
                  aria-label="집중도"
                  className="h-11 w-full accent-primary"
                />
                <FieldError>{errors.focus}</FieldError>
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="entry-date">몰입 날짜</FieldLabel>
            <FieldContent>
              <Input
                id="entry-date"
                type="date"
                value={values.entry_date}
                onChange={(event) => onChange('entry_date', event.target.value)}
                aria-invalid={Boolean(errors.entry_date)}
              />
              <FieldError>{errors.entry_date}</FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="entry-reflection">오늘의 기록</FieldLabel>
            <FieldContent>
              <Textarea
                id="entry-reflection"
                value={values.reflection}
                onChange={(event) => onChange('reflection', event.target.value)}
                aria-invalid={Boolean(errors.reflection)}
                placeholder="오늘 집중이 어떻게 흘렀는지 적어 주세요."
              />
              <FieldError>{errors.reflection}</FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="entry-wins">잘한 점</FieldLabel>
            <FieldContent>
              <Textarea
                id="entry-wins"
                value={values.wins}
                onChange={(event) => onChange('wins', event.target.value)}
                placeholder="작게라도 잘된 점"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="entry-blockers">방해 요소</FieldLabel>
            <FieldContent>
              <Textarea
                id="entry-blockers"
                value={values.blockers}
                onChange={(event) => onChange('blockers', event.target.value)}
                placeholder="집중을 방해한 요소"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="entry-next-step">다음 행동</FieldLabel>
            <FieldContent>
              <Textarea
                id="entry-next-step"
                value={values.next_step}
                onChange={(event) => onChange('next_step', event.target.value)}
                aria-invalid={Boolean(errors.next_step)}
                placeholder="저장 후 바로 실행할 한 가지 액션"
              />
              <FieldError>{errors.next_step}</FieldError>
            </FieldContent>
          </Field>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? <Spinner className="mr-2 size-4" /> : null}
              {submitLabel}
            </Button>
            <p className="self-center text-sm text-muted-foreground">
              제출 중에는 버튼이 비활성화됩니다.
            </p>
          </div>
        </div>
      </form>

      <EntryPreview values={values} />
    </div>
  );
}
