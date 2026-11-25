'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import type { FlowEntry } from '@/lib/types';

export function useEntryDetail(id?: string) {
  const { user } = useAuth();
  const userId = user?.id;
  const [entry, setEntry] = useState<FlowEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeRequest = useRef<AbortController | null>(null);

  const fetchEntry = useCallback(async () => {
    activeRequest.current?.abort();
    setEntry(null);
    setError(null);

    if (!userId || !id || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const request = new AbortController();
    activeRequest.current = request;

    const { data, error: requestError } = await supabase
      .from('flow_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .abortSignal(request.signal)
      .maybeSingle();

    if (request.signal.aborted) return;

    if (requestError) {
      setEntry(null);
      setError('기록을 불러오지 못했습니다.');
      setLoading(false);
      return;
    }

    setEntry(data as FlowEntry | null);
    setLoading(false);
  }, [id, userId]);

  useEffect(() => {
    void fetchEntry();
    return () => activeRequest.current?.abort();
  }, [fetchEntry]);

  return {
    entry,
    loading,
    error,
    refresh: fetchEntry,
  };
}
