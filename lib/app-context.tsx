'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Notice } from '@/lib/types';

type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

type NoticeContextValue = {
  notices: Notice[];
  notify: (notice: Omit<Notice, 'id'>) => void;
  dismissNotice: (id: string) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
export const AuthContext = createContext<AuthContextValue | null>(null);
export const NoticeContext = createContext<NoticeContextValue | null>(null);

export function AppContextProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('flowday-theme');
    const initialTheme =
      savedTheme === 'dark' || savedTheme === 'light'
        ? savedTheme
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';

    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('flowday-theme', theme);
  }, [theme]);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) {
          return;
        }

        setSession(data.session);
        setUser(data.session?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setSession(null);
        setUser(null);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const dismissNotice = useCallback((id: string) => {
    setNotices((current) => current.filter((notice) => notice.id !== id));
  }, []);

  const notify = useCallback((notice: Omit<Notice, 'id'>) => {
    const id = crypto.randomUUID();
    setNotices((current) => [...current, { ...notice, id }]);

    window.setTimeout(() => {
      setNotices((current) => current.filter((item) => item.id !== id));
    }, 3600);
  }, []);

  const themeValue = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme],
  );
  const authValue = useMemo(
    () => ({ session, user, loading }),
    [loading, session, user],
  );
  const noticeValue = useMemo(
    () => ({ notices, notify, dismissNotice }),
    [dismissNotice, notices, notify],
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <AuthContext.Provider value={authValue}>
        <NoticeContext.Provider value={noticeValue}>
          {children}
        </NoticeContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
