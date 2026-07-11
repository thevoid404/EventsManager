'use client';

import Link from 'next/link';
import { Users, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Team } from '@/types';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-all duration-200 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 border border-border">
          {/* Default icon if no logo, you can add logo logic later if team has logoUrl */}
          <AvatarFallback className="bg-primary/10 text-primary">
            <UsersRound className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold truncate leading-tight">
            {team.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <Users className="h-3 w-3" />
            {team.currentMembers} / {team.maxMembers} members
          </p>
        </div>
      </div>
      
      {team.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {team.description}
        </p>
      )}

      <div className="mt-auto pt-2">
        <Button asChild variant="outline" size="sm" className="w-full text-xs h-8">
          <Link href={`/events/${team.eventId}/teams/${team.id}`}>
            View Team
          </Link>
        </Button>
      </div>
    </div>
  );
}
