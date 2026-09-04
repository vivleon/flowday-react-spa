import { MOOD_OPTIONS, type FlowEntryDraft, type FlowEntryErrors } from '@/lib/types';

export const emptyDraft = (): FlowEntryDraft => ({
  title: '',
  mood: 'Focused',
  energy: 3,
  focus: 3,
  reflection: '',
  wins: '',
  blockers: '',
  next_step: '',
  entry_date: new Date().toISOString().slice(0, 10),
});

export function validateEntry(values: FlowEntryDraft) {
  const errors: FlowEntryErrors = {};

  if (!values.title.trim()) {
    errors.title = '타이틀을 입력해 주세요.';
  }

  if (!values.reflection.trim()) {
    errors.reflection = '오늘의 기록을 남겨 주세요.';
  }

  if (!values.next_step.trim()) {
    errors.next_step = '다음 액션을 적어 주세요.';
  }

  if (!values.entry_date) {
    errors.entry_date = '날짜를 선택해 주세요.';
  }

  if (!MOOD_OPTIONS.includes(values.mood)) {
    errors.mood = '유효한 무드를 선택해 주세요.';
  }

  if (values.energy < 1 || values.energy > 5) {
    errors.energy = '에너지는 1~5 사이여야 합니다.';
  }

  if (values.focus < 1 || values.focus > 5) {
    errors.focus = '집중도는 1~5 사이여야 합니다.';
  }

  return errors;
}

export function hasErrors(errors: FlowEntryErrors) {
  return Object.values(errors).some(Boolean);
}
