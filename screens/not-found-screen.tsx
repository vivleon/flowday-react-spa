import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export function NotFoundScreen() {
  return (
    <main className="glass-panel flex min-h-[70vh] flex-col items-center justify-center gap-6 border-none px-6 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-primary">404</p>
      <h1 className="text-4xl font-semibold tracking-tight">
        잘못된 주소입니다.
      </h1>
      <p className="max-w-lg text-base leading-7 text-muted-foreground">
        주소가 바뀌었거나 존재하지 않는 페이지입니다. 홈으로 돌아가 다시 시작해
        주세요.
      </p>
      <Link href="/" className={buttonVariants({ size: 'lg' })}>
        홈으로 돌아가기
      </Link>
    </main>
  );
}
