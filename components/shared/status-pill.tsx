import { Badge } from '@/components/ui/badge';
import type { Mood } from '@/lib/types';

const toneByMood: Record<Mood, 'default' | 'secondary' | 'outline'> = {
  Calm: 'secondary',
  Focused: 'default',
  Electric: 'outline',
  Foggy: 'outline',
  Heavy: 'secondary',
};

export function StatusPill({ mood }: { mood: Mood }) {
  return <Badge variant={toneByMood[mood]}>{mood}</Badge>;
}
