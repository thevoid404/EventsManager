'use client';

import { TeamCard } from './TeamCard';
import type { Team } from '@/types';
import { UsersRound, Sparkles } from 'lucide-react';

interface TeamGridProps {
  teams: Team[];
  emptyMessage?: string;
  action?: React.ReactNode;
}

export function TeamGrid({ teams, emptyMessage = 'No squads recorded for this event.', action }: TeamGridProps) {
  if (teams.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-[#111114] border border-dashed border-white/10 text-center space-y-3">
        <UsersRound className="w-8 h-8 text-[#8A8A93] mx-auto" />
        <div className="space-y-1">
          <h3 className="text-sm font-heading font-bold text-[#F4F4F0] uppercase">
            NO SQUADS FORMED
          </h3>
          <p className="text-xs text-[#8A8A93] max-w-xs mx-auto">
            {emptyMessage}
          </p>
        </div>
        {action && <div className="pt-2">{action}</div>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
