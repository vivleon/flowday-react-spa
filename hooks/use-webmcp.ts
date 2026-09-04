'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth, useNotice } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { MOOD_OPTIONS, type FlowEntry } from '@/lib/types';

type CreateInput = {
  title?: unknown;
  mood?: unknown;
  reflection?: unknown;
  nextStep?: unknown;
  energy?: unknown;
  focus?: unknown;
  entryDate?: unknown;
};

function validateCreateInput(input: unknown) {
  if (!input || typeof input !== 'object') throw new Error('입력 객체가 필요합니다.');
  const value = input as CreateInput;
  const title = typeof value.title === 'string' ? value.title.trim() : '';
  const reflection = typeof value.reflection === 'string' ? value.reflection.trim() : '';
  const nextStep = typeof value.nextStep === 'string' ? value.nextStep.trim() : '';
  const mood = typeof value.mood === 'string' && MOOD_OPTIONS.includes(value.mood as FlowEntry['mood']) ? value.mood as FlowEntry['mood'] : 'Focused';
  const energy = Number(value.energy ?? 3);
  const focus = Number(value.focus ?? 3);
  const entryDate = typeof value.entryDate === 'string' ? value.entryDate : new Date().toISOString().slice(0, 10);

  if (title.length < 2 || title.length > 80) throw new Error('title은 2자 이상 80자 이하여야 합니다.');
  if (!reflection) throw new Error('reflection은 필수입니다.');
  if (!nextStep) throw new Error('nextStep은 필수입니다.');
  if (!Number.isInteger(energy) || energy < 1 || energy > 5) throw new Error('energy는 1부터 5 사이의 정수여야 합니다.');
  if (!Number.isInteger(focus) || focus < 1 || focus > 5) throw new Error('focus는 1부터 5 사이의 정수여야 합니다.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) throw new Error('entryDate는 YYYY-MM-DD 형식이어야 합니다.');

  return { title, reflection, next_step: nextStep, mood, energy, focus, entry_date: entryDate, wins: '', blockers: '' };
}

export function useWebMcp() {
  const { user } = useAuth();
  const { notify } = useNotice();
  const router = useRouter();

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool || !user) return;

    const lifecycle = new AbortController();
    const ignoreRegistrationError = () => undefined;

    try {
      void Promise.resolve(context.registerTool({
        name: 'list_flow_entries',
        title: '몰입 기록 목록 조회',
        description: '현재 로그인 사용자의 Flowday 몰입 기록을 최신 날짜순으로 조회합니다.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: true },
        async execute() {
          const { data, error } = await supabase.from('flow_entries').select('id,title,mood,energy,focus,entry_date').order('entry_date', { ascending: false });
          if (error) throw error;
          return { count: data.length, entries: data };
        },
      }, { signal: lifecycle.signal })).catch(ignoreRegistrationError);

      void Promise.resolve(context.registerTool({
        name: 'create_flow_entry',
        title: '몰입 기록 생성',
        description: '입력값을 검증하고 현재 로그인 사용자의 Flowday 몰입 기록을 만든 뒤 상세 화면으로 이동합니다.',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 2, maxLength: 80 },
            mood: { type: 'string', enum: [...MOOD_OPTIONS] },
            reflection: { type: 'string', minLength: 1 },
            nextStep: { type: 'string', minLength: 1 },
            energy: { type: 'integer', minimum: 1, maximum: 5 },
            focus: { type: 'integer', minimum: 1, maximum: 5 },
            entryDate: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
          },
          required: ['title', 'reflection', 'nextStep'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) {
          const payload = validateCreateInput(input);
          const { data, error } = await supabase.from('flow_entries').insert(payload).select('id,title').single();
          if (error) throw error;
          notify({ tone: 'success', title: '새 몰입 기록을 저장했어요.', description: data.title });
          router.push(`/entries/${data.id}`);
          return { id: data.id, status: 'created', path: `/entries/${data.id}` };
        },
      }, { signal: lifecycle.signal })).catch(ignoreRegistrationError);
    } catch {
      ignoreRegistrationError();
    }

    return () => lifecycle.abort();
  }, [notify, router, user]);
}
