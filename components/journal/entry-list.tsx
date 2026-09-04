import { EntryCard } from '@/components/journal/entry-card';
import type { FlowEntry } from '@/lib/types';

export function EntryList({ entries }: { entries: FlowEntry[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
