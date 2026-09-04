'use client';

import { useContext } from 'react';
import { AuthContext, NoticeContext, ThemeContext } from '@/lib/app-context';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AppContextProvider');
  }

  return context;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within AppContextProvider');
  }

  return context;
}

export function useNotice() {
  const context = useContext(NoticeContext);

  if (!context) {
    throw new Error('useNotice must be used within AppContextProvider');
  }

  return context;
}
