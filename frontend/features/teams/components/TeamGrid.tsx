'use client';

import { TeamCard } from './TeamCard';
import type { Team } from '@/types';
import { EmptyState } from '@/components/empty-state';
import { UsersRound } from 'lucide-react';

interface TeamGridProps {
  teams: Team[];
  emptyMessage?: string;
  action?: React.ReactNode;
}

export function TeamGrid({ teams, emptyMessage = 'No teams found.', action }: TeamGridProps) {
  if (teams.length === 0) {
    return (
      <EmptyState
        icon={UsersRound}
        title="No Teams"
        description={emptyMessage}
        action={action}
        className="py-12 border border-dashed rounded-lg"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
