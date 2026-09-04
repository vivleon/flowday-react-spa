import { EntryFormScreen } from '@/screens/entry-form-screen';

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EntryFormScreen mode="edit" id={id} />;
}
