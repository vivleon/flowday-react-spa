import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  throw new Error('원격 테스트용 Supabase 환경변수가 필요합니다.');
}

const client = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

let userId;
let entryId;

try {
  const { data: authData, error: authError } = await client.auth.signInAnonymously();
  if (authError) throw authError;
  userId = authData.user?.id;
  assert(userId, '익명 인증 세션이 생성되지 않았습니다.');

  const { data: created, error: createError } = await client
    .from('flow_entries')
    .insert({
      title: 'REMOTE CRUD CHECK',
      mood: 'Focused',
      energy: 3,
      focus: 4,
      reflection: '자동 원격 검증용 기록',
      wins: '',
      blockers: '',
      next_step: '검증 후 삭제',
      entry_date: new Date().toISOString().slice(0, 10),
    })
    .select('*')
    .single();
  if (createError) throw createError;
  entryId = created.id;
  assert(created.user_id === userId, '생성 데이터의 소유자가 일치하지 않습니다.');

  const { data: read, error: readError } = await client.from('flow_entries').select('*').eq('id', entryId).single();
  if (readError) throw readError;
  assert(read.title === 'REMOTE CRUD CHECK', '원격 조회 결과가 일치하지 않습니다.');

  const { data: updated, error: updateError } = await client.from('flow_entries').update({ focus: 5 }).eq('id', entryId).select('*').single();
  if (updateError) throw updateError;
  assert(updated.focus === 5, '원격 수정 결과가 일치하지 않습니다.');

  const { error: deleteError } = await client.from('flow_entries').delete().eq('id', entryId);
  if (deleteError) throw deleteError;
  entryId = undefined;

  const { data: removed, error: removedError } = await client.from('flow_entries').select('id').eq('id', created.id);
  if (removedError) throw removedError;
  assert(removed.length === 0, '원격 삭제 결과가 일치하지 않습니다.');

  console.log('PASS auth -> create -> read -> update -> delete -> RLS owner check');
} finally {
  if (entryId) await client.from('flow_entries').delete().eq('id', entryId);
  if (userId) await admin.auth.admin.deleteUser(userId);
}
