import { TeamDetailView } from '@/features/teams/components/TeamDetailView';

export default function TeamPage({ params }: { params: { id: string; teamId: string } }) {
  // We can extract eventId from params.id if needed, but the view fetches by teamId
  return <TeamDetailView teamId={params.teamId} />;
}
