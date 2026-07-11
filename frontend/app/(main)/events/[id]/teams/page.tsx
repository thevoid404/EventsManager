'use client';

import { useTeams } from '@/features/teams/hooks/useTeams';
import { TeamGrid } from '@/features/teams/components/TeamGrid';
import { ErrorState } from '@/components/error-state';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function TeamsListPage({ params }: { params: { id: string } }) {
  const { id: eventId } = params;
  const { isAuthenticated } = useAuth();
  const { data: teams, isLoading, isError, refetch } = useTeams(eventId);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 border border-border rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !teams) {
    return (
      <div className="pt-10">
        <ErrorState
          description="Could not load teams. It may have been removed or there is a network error."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        href={`/events/${eventId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Event
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Event Teams</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Browse and join teams for this event.
          </p>
        </div>
        {isAuthenticated && (
          <Button asChild size="sm" className="gap-1.5 shrink-0">
            <Link href={`/events/${eventId}/teams/create`}>
              <Plus className="h-3.5 w-3.5" />
              Create Team
            </Link>
          </Button>
        )}
      </div>

      <TeamGrid
        teams={teams}
        emptyMessage="No teams have been formed for this event yet."
        action={
          isAuthenticated ? (
            <Button asChild size="sm">
              <Link href={`/events/${eventId}/teams/create`}>Create a team</Link>
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
