'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import type { FlowEntry } from '@/lib/types';

export function useEntryDetail(id?: string) {
  const { user } = useAuth();
  const userId = user?.id;
  const [entry, setEntry] = useState<FlowEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntry = useCallback(async () => {
    if (!userId || !id) {
      setEntry(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: requestError } = await supabase
      .from('flow_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (requestError) {
      setEntry(null);
      setError('기록을 불러오지 못했습니다.');
      setLoading(false);
      return;
    }

    setEntry(data as FlowEntry);
    setLoading(false);
  }, [id, userId]);

  useEffect(() => {
    void fetchEntry();
  }, [fetchEntry]);

  return {
    entry,
    loading,
    error,
    refresh: fetchEntry,
  };
}
