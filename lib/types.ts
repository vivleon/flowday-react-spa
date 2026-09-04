export const MOOD_OPTIONS = [
  'Calm',
  'Focused',
  'Electric',
  'Foggy',
  'Heavy',
] as const;

export type Mood = (typeof MOOD_OPTIONS)[number];

export type FlowEntry = {
  id: string;
  user_id: string;
  title: string;
  mood: Mood;
  energy: number;
  focus: number;
  reflection: string;
  wins: string;
  blockers: string;
  next_step: string;
  entry_date: string;
  created_at: string;
  updated_at: string;
};

export type FlowEntryDraft = Omit<
  FlowEntry,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;

export type FlowEntryErrors = Partial<Record<keyof FlowEntryDraft, string>>;

export type Notice = {
  id: string;
  title: string;
  description?: string;
  tone: 'success' | 'error' | 'info';
};
