import { describe, expect, it } from 'vitest';

import { emptyDraft, hasErrors, validateEntry } from '@/lib/validation';

describe('validateEntry', () => {
  it('필수 입력이 비어 있으면 각 필드 오류를 반환한다', () => {
    const errors = validateEntry(emptyDraft());
    expect(errors.title).toBeTruthy();
    expect(errors.reflection).toBeTruthy();
    expect(errors.next_step).toBeTruthy();
    expect(hasErrors(errors)).toBe(true);
  });

  it('에너지와 집중도가 범위를 벗어나면 거부한다', () => {
    const errors = validateEntry({
      ...emptyDraft(),
      title: '테스트 기록',
      reflection: '충분히 집중했다.',
      next_step: '다음 단계',
      energy: 0,
      focus: 6,
    });
    expect(errors.energy).toContain('1~5');
    expect(errors.focus).toContain('1~5');
  });

  it('유효한 입력은 오류 없이 통과한다', () => {
    const errors = validateEntry({
      ...emptyDraft(),
      title: 'React 상태 흐름 정리',
      reflection: '이벤트와 렌더링의 연결을 확인했다.',
      next_step: '커스텀 훅 테스트 작성',
    });
    expect(errors).toEqual({});
    expect(hasErrors(errors)).toBe(false);
  });
});
