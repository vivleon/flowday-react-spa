import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { EntryPreview } from '@/components/journal/entry-preview';
import { ErrorState, LoadingState } from '@/components/shared/state-panel';
import { emptyDraft } from '@/lib/validation';

describe('공통 비동기 상태 UI', () => {
  it('로딩 상태를 일관된 문구로 보여 준다', () => {
    render(<LoadingState />);
    expect(screen.getByText('불러오는 중입니다.')).toBeInTheDocument();
  });

  it('에러 상태에서 재시도 이벤트를 전달한다', () => {
    const retry = vi.fn();
    render(<ErrorState description="네트워크 오류" onRetry={retry} />);
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(retry).toHaveBeenCalledOnce();
  });
});

describe('실시간 미리보기', () => {
  it('controlled input 상태가 바뀌면 카드 내용도 바뀐다', () => {
    const { rerender } = render(<EntryPreview values={emptyDraft()} />);
    expect(screen.getByText('오늘의 로그 제목')).toBeInTheDocument();

    rerender(<EntryPreview values={{ ...emptyDraft(), title: '새 제목', reflection: '새 회고', next_step: '새 행동' }} />);
    expect(screen.getByText('새 제목')).toBeInTheDocument();
    expect(screen.getByText('새 회고')).toBeInTheDocument();
    expect(screen.getByText('새 행동')).toBeInTheDocument();
  });
});
