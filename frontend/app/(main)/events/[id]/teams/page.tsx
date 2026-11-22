'use client';

import React, { use } from 'react';
import { useTeams } from '@/features/teams/hooks/useTeams';
import { TeamGrid } from '@/features/teams/components/TeamGrid';
import { ErrorState } from '@/components/error-state';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Plus, UsersRound, Radio } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function TeamsListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: eventId } = use(params);
  const { isAuthenticated } = useAuth();
  const { data: teams, isLoading, isError, refetch } = useTeams(eventId);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse pb-16">
        <div className="h-4 w-36 bg-white/10 rounded" />
        <div className="h-10 w-64 bg-white/10 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 rounded-xl bg-[#111114] border border-white/8" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !teams) {
    return (
      <div className="pt-10">
        <ErrorState
          description="Could not synchronize squad data for this dispatch."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <Link
        href={`/events/${eventId}`}
        className="inline-flex items-center gap-2 text-xs font-mono text-[#8A8A93] hover:text-[#FF4D00] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        BACK TO EVENT DISPATCH
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111114] border border-white/10 shadow-lg">
        <div className="space-y-1">
          <div className="text-[10px] font-mono tracking-widest text-[#C8FF00] uppercase font-bold flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[#C8FF00] animate-pulse" />
            SQUAD ROSTERS // {teams.length} FORMED
          </div>
          <h1 className="text-2xl font-heading font-black tracking-tight text-[#F4F4F0] uppercase">
            EVENT SQUADS DIRECTORY
          </h1>
          <p className="text-xs text-[#8A8A93]">
            Inspect participating squads, view open positions, or establish your own crew.
          </p>
        </div>

        {isAuthenticated && (
          <Button
            asChild
            size="sm"
            className="h-10 px-4 font-mono text-xs uppercase bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-bold gap-2 shadow-[0_4px_20px_rgba(255,77,0,0.3)] shrink-0"
          >
            <Link href={`/events/${eventId}/teams/create`}>
              <Plus className="w-4 h-4" />
              Establish Squad
            </Link>
          </Button>
        )}
      </div>

      <TeamGrid
        teams={teams}
        emptyMessage="No squads have formed for this dispatch yet."
        action={
          isAuthenticated ? (
            <Button asChild size="sm" className="h-8 font-mono text-xs bg-[#FF4D00] text-white font-bold">
              <Link href={`/events/${eventId}/teams/create`}>ESTABLISH FIRST SQUAD</Link>
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
