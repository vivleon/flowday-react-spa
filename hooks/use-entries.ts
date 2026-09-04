'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import type { FlowEntry, Mood } from '@/lib/types';

type Filters = {
  search: string;
  mood: Mood | 'All';
};

export function useEntries(filters: Filters) {
  const { user } = useAuth();
  const userId = user?.id;
  const [entries, setEntries] = useState<FlowEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    if (!userId) {
      setEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: requestError } = await supabase
      .from('flow_entries')
      .select('*')
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (requestError) {
      setEntries([]);
      setError('요청에 실패했습니다. 다시 시도하세요.');
      setLoading(false);
      return;
    }

    setEntries((data ?? []) as FlowEntry[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void fetchEntries();
  }, [fetchEntries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesMood =
        filters.mood === 'All' ? true : entry.mood === filters.mood;
      const keyword = filters.search.trim().toLowerCase();
      const matchesSearch = keyword
        ? [entry.title, entry.reflection, entry.next_step]
            .join(' ')
            .toLowerCase()
            .includes(keyword)
        : true;

      return matchesMood && matchesSearch;
    });
  }, [entries, filters.mood, filters.search]);

  const deleteEntry = async (id: string) => {
    const { error: requestError } = await supabase
      .from('flow_entries')
      .delete()
      .eq('id', id);

    if (requestError) {
      throw new Error('삭제에 실패했습니다. 잠시 후 다시 시도하세요.');
    }

    await fetchEntries();
  };

  return {
    entries,
    filteredEntries,
    loading,
    error,
    refresh: fetchEntries,
    deleteEntry,
  };
}
