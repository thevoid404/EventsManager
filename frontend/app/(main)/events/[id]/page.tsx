import { EventDetailView } from '@/features/events/components/EventDetailView';

// Server component: unwraps async params and passes id to the client view.
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventDetailView id={id} />;
}
