import { TeamDetailView } from '@/features/teams/components/TeamDetailView';

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string; teamId: string }>;
}) {
  const { teamId } = await params;
  return <TeamDetailView teamId={teamId} />;
}
