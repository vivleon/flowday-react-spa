import { supabase } from '@/lib/supabase';
import type { FlowEntryDraft } from '@/lib/types';

function dateFromToday(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

const demoEntries = (): FlowEntryDraft[] => [
  {
    title: 'React 상태 흐름 정리',
    mood: 'Electric',
    energy: 4,
    focus: 5,
    reflection: '사용자 이벤트에서 상태 변경, 그리고 리렌더링으로 이어지는 흐름을 작은 예제로 정리했다.',
    wins: 'useEffect 의존성과 데이터 요청의 관계가 명확해졌다.',
    blockers: '비동기 요청의 실패 상태를 놓치기 쉬웠다.',
    next_step: '커스텀 훅에 재시도 흐름 추가하기',
    entry_date: dateFromToday(0),
  },
  {
    title: '포트폴리오 문장 다듬기',
    mood: 'Focused',
    energy: 3,
    focus: 4,
    reflection: '프로젝트 소개를 기능 나열 대신 해결한 문제 중심으로 다시 썼다.',
    wins: '첫 문장이 훨씬 짧고 구체적으로 바뀌었다.',
    blockers: '',
    next_step: '대표 화면과 설명 문장 연결하기',
    entry_date: dateFromToday(-1),
  },
  {
    title: '주간 회고와 다음 목표',
    mood: 'Calm',
    energy: 3,
    focus: 3,
    reflection: '잘한 일과 줄일 일을 하나씩 고르고 다음 주 첫 행동을 정했다.',
    wins: '완벽보다 꾸준함에 집중했다.',
    blockers: '할 일을 너무 많이 잡았다.',
    next_step: '월요일 첫 25분 계획 세우기',
    entry_date: dateFromToday(-2),
  },
];

export async function seedDemoEntries() {
  const { count, error: countError } = await supabase
    .from('flow_entries')
    .select('id', { count: 'exact', head: true });

  if (countError) throw countError;
  if ((count ?? 0) > 0) return;

  const { error } = await supabase.from('flow_entries').insert(demoEntries());
  if (error) throw error;
}
