import Link from 'next/link';
import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button, buttonVariants } from '@/components/ui/button';

export function LoadingState({
  title = '불러오는 중입니다.',
  description = '잠시만 기다려 주세요.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Empty className="glass-panel min-h-[280px] border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Loader2 className="size-4 animate-spin" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function ErrorState({
  title = '요청에 실패했습니다.',
  description = '다시 시도해 주세요.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <Empty className="glass-panel min-h-[280px] border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangle className="size-4" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {onRetry ? (
        <EmptyContent>
          <Button type="button" onClick={onRetry}>
            다시 시도
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <Empty className="glass-panel min-h-[280px] border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox className="size-4" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {ctaLabel && ctaHref ? (
        <EmptyContent>
          <Link href={ctaHref} className={buttonVariants({})}>
            {ctaLabel}
          </Link>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
