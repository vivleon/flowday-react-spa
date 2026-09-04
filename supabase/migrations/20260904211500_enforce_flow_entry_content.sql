alter table public.flow_entries
  add constraint flow_entries_title_length
  check (char_length(btrim(title)) between 2 and 80),
  add constraint flow_entries_reflection_not_blank
  check (char_length(btrim(reflection)) > 0),
  add constraint flow_entries_next_step_not_blank
  check (char_length(btrim(next_step)) > 0);
