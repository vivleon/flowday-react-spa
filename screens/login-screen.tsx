'use client';

import Link from 'next/link';
import { startTransition, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useNotice } from '@/hooks/use-auth';
import { seedDemoEntries } from '@/lib/demo-data';
import { supabase } from '@/lib/supabase';

type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'root', string>>;

function authMessage(message: string) {
  if (/invalid login credentials/i.test(message)) return '이메일 또는 비밀번호를 확인해 주세요.';
  if (/user already registered/i.test(message)) return '이미 가입된 이메일입니다.';
  if (/fetch|network/i.test(message)) return '네트워크 연결을 확인한 뒤 다시 시도해 주세요.';
  return message;
}

export function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { notify } = useNotice();
  const [mode, setMode] = useState<'signin' | 'signup'>(() => searchParams?.get('mode') === 'signup' ? 'signup' : 'signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const nextPath = useMemo(() => {
    const requested = searchParams?.get('next');
    return requested?.startsWith('/') && !requested.startsWith('//') ? requested : '/entries';
  }, [searchParams]);

  const validate = () => {
    const nextErrors: FieldErrors = {};
    if (mode === 'signup' && (name.trim().length < 2 || name.trim().length > 30)) nextErrors.name = '이름은 2자 이상 30자 이하로 입력해 주세요.';
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = '올바른 이메일을 입력해 주세요.';
    if (password.length < 6) nextErrors.password = '비밀번호는 6자 이상 입력해 주세요.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});

    const request = mode === 'signin'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password, options: { data: { display_name: name.trim() } } });
    const { data, error } = await request;

    if (error) {
      setErrors({ root: authMessage(error.message) });
      setSubmitting(false);
      return;
    }

    if (!data.session && mode === 'signup') {
      setErrors({ root: '가입 확인 메일을 확인한 뒤 로그인해 주세요.' });
      setSubmitting(false);
      return;
    }

    notify({ tone: 'success', title: mode === 'signin' ? '다시 만나서 반가워요.' : 'Flowday에 오신 걸 환영해요.', description: '오늘의 몰입을 이어가 볼까요?' });
    setSubmitting(false);
    startTransition(() => router.replace(nextPath));
  };

  const handleDemo = async () => {
    setSubmitting(true);
    setErrors({});
    const { data, error } = await supabase.auth.signInAnonymously({ options: { data: { display_name: '오늘의 탐험가', demo: true } } });
    if (error || !data.user) {
      setErrors({ root: authMessage(error?.message ?? '체험 계정을 시작하지 못했습니다.') });
      setSubmitting(false);
      return;
    }

    try {
      await seedDemoEntries();
      notify({ tone: 'success', title: '체험 공간을 준비했어요.', description: '샘플 기록 세 개를 함께 담았습니다.' });
    } catch {
      notify({ tone: 'info', title: '빈 체험 공간으로 시작합니다.', description: '첫 기록을 직접 만들어 보세요.' });
    }
    setSubmitting(false);
    startTransition(() => router.replace('/entries'));
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) setErrors({ root: authMessage(error.message) });
    else notify({ tone: 'info', title: '로그아웃했어요.' });
  };

  return (
    <main className="grid gap-6 lg:grid-cols-[.84fr_1.16fr]">
      <section className="glass-panel relative min-h-[560px] overflow-hidden border-none bg-foreground p-7 text-background md:p-10">
        <div className="absolute -right-32 -top-28 size-[30rem] rounded-full bg-primary/35 blur-3xl" />
        <div className="relative flex h-full min-h-[490px] flex-col justify-between">
          <p className="text-xs font-bold uppercase tracking-[.24em] text-background/45">FLOWDAY / START</p>
          <h1 className="max-w-lg text-[clamp(3rem,7vw,5.4rem)] font-black leading-[.9] tracking-[-.07em]">작은 몰입이<br /><span className="text-accent">나만의 리듬</span>이<br />되는 곳.</h1>
          <p className="max-w-sm text-base leading-7 text-background/60">오늘의 집중과 감정을 기록하고, 다음 행동을 한 문장으로 남겨보세요.</p>
        </div>
      </section>

      <section className="glass-panel border-none p-6 md:p-10">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">WELCOME</p><h2 className="mt-2 text-4xl font-black tracking-[-.055em]">{user ? '이미 로그인했어요' : mode === 'signin' ? '다시 이어가기' : '새 리듬 만들기'}</h2></div>
          <Link href="/" className={buttonVariants({ variant: 'ghost' })}>
            <ArrowLeft />
            홈
          </Link>
        </div>

        {user ? (
            <div className="mt-10 space-y-5 rounded-[1.5rem] bg-secondary/70 p-6">
            <p className="text-sm text-muted-foreground">현재 계정</p>
            <p className="text-lg font-bold">{user.email || '체험 계정'}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/entries" className={buttonVariants({})}>
                내 기록 보기
              </Link>
              <Button type="button" variant="outline" onClick={handleSignOut}>
                로그아웃
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 rounded-xl bg-secondary p-1" role="tablist" aria-label="인증 방식">
              <button type="button" role="tab" aria-selected={mode === 'signin'} onClick={() => { setMode('signin'); setErrors({}); }} className={`rounded-lg px-4 py-2.5 text-sm font-extrabold transition ${mode === 'signin' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>로그인</button>
              <button type="button" role="tab" aria-selected={mode === 'signup'} onClick={() => { setMode('signup'); setErrors({}); }} className={`rounded-lg px-4 py-2.5 text-sm font-extrabold transition ${mode === 'signup' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>회원가입</button>
            </div>
            <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
              {errors.root && <p className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive" role="alert">{errors.root}</p>}
              {mode === 'signup' && <div className="space-y-2"><Label htmlFor="name">이름</Label><div className="relative"><UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="name" value={name} onChange={(event) => { setName(event.target.value); setErrors((current) => ({ ...current, name: undefined })); }} placeholder="어떻게 불러드릴까요?" className="h-12 rounded-xl pl-10" aria-invalid={Boolean(errors.name)} /></div>{errors.name && <p className="text-sm font-semibold text-destructive">{errors.name}</p>}</div>}
              <div className="space-y-2"><Label htmlFor="email">이메일</Label><div className="relative"><Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined })); }} placeholder="you@example.com" className="h-12 rounded-xl pl-10" aria-invalid={Boolean(errors.email)} /></div>{errors.email && <p className="text-sm font-semibold text-destructive">{errors.email}</p>}</div>
              <div className="space-y-2"><Label htmlFor="password">비밀번호</Label><div className="relative"><LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined })); }} placeholder="6자 이상 입력" className="h-12 rounded-xl pl-10" aria-invalid={Boolean(errors.password)} /></div>{errors.password && <p className="text-sm font-semibold text-destructive">{errors.password}</p>}</div>
              <Button type="submit" size="lg" disabled={submitting} className="h-12 w-full rounded-xl text-base font-bold">{submitting ? <Loader2 className="animate-spin" /> : <Sparkles />}{submitting ? '처리하는 중…' : mode === 'signin' ? '로그인' : 'Flowday 시작하기'}</Button>
            </form>
            <div className="my-6 flex items-center gap-3 text-xs font-bold text-muted-foreground"><span className="h-px flex-1 bg-border" />또는<span className="h-px flex-1 bg-border" /></div>
            <Button type="button" variant="outline" onClick={handleDemo} disabled={submitting} className="h-12 w-full rounded-xl">가입 없이 체험 계정으로 둘러보기</Button>
          </>
        )}
      </section>
    </main>
  );
}
