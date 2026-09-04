import { EntryDetailScreen } from '@/screens/entry-detail-screen';

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EntryDetailScreen id={id} />;
}
