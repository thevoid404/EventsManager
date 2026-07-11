'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTeam } from '@/features/teams/hooks/useTeam';
import { useJoinRequest } from '@/features/teams/hooks/useJoinRequest';
import { JoinRequestModal } from './JoinRequestModal';
import { TeamJoinRequests } from './TeamJoinRequests';
import { ErrorState } from '@/components/error-state';
import { SectionHeader } from '@/components/section-header';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Users, Shield, MessageCircle, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function TeamDetailView({ teamId }: { teamId: string }) {
  const { isAuthenticated } = useAuth();
  const { data: team, isLoading, isError, refetch } = useTeam(teamId);
  const { mutateAsync: sendRequest, isPending: isSendingRequest } = useJoinRequest(teamId);
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="h-32 bg-muted rounded-xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
          <div className="h-32 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !team) {
    return (
      <ErrorState
        description="Could not load team details."
        onRetry={() => refetch()}
      />
    );
  }

  const isFull = team.currentMembers >= team.maxMembers;
  const canJoin = isAuthenticated && !team.isCurrentUserMember && !team.isCurrentUserLeader && !isFull;

  const handleJoinRequest = async (introduction: string) => {
    await sendRequest({ introduction });
    setModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        href={`/events/${team.eventId}/teams`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Teams
      </Link>

      {/* Header Card */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">{team.name}</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <Users className="h-4 w-4" />
            {team.currentMembers} / {team.maxMembers} Members
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-md">
            <Info className="h-3.5 w-3.5" />
            Looking for: <span className="font-medium text-foreground">{team.lookingFor}</span>
          </div>
        </div>

        <div className="shrink-0 flex gap-3">
          {team.isCurrentUserMember || team.isCurrentUserLeader ? (
            <Button disabled variant="secondary" className="gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              You are a member
            </Button>
          ) : canJoin ? (
            <Button onClick={() => setModalOpen(true)}>Request to Join</Button>
          ) : isFull ? (
            <Button disabled variant="secondary">Team is Full</Button>
          ) : !isAuthenticated ? (
            <Button asChild>
              <Link href="/login">Login to Join</Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <SectionHeader title="About Team" className="mb-4" />
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {team.description}
            </p>
          </section>

          <section>
            <SectionHeader title="Members" className="mb-4" />
            <div className="space-y-3">
              {team.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs bg-muted">
                      {member.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none flex items-center gap-2">
                      {member.name}
                      {member.isLeader && (
                        <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-sm tracking-wider">
                          Leader
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{member.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Leader specific section */}
          {team.isCurrentUserLeader && (
            <section className="bg-muted/50 p-6 rounded-xl border border-border">
              <SectionHeader title="Pending Requests" className="mb-4 border-none mt-0" />
              <TeamJoinRequests teamId={team.id} />
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Contact Info (Only visible to members) */}
          {(team.isCurrentUserMember || team.isCurrentUserLeader) && (
            <section className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Contact Info
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">WhatsApp</span>
                  <a href={team.whatsapp?.startsWith('http') ? team.whatsapp : `https://wa.me/${team.whatsapp}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline break-all">
                    {team.whatsapp}
                  </a>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Facebook</span>
                  <a href={team.facebook} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline break-all">
                    {team.facebook}
                  </a>
                </div>
                {team.discord && (
                  <div>
                    <span className="text-muted-foreground block text-xs">Discord</span>
                    <a href={team.discord} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline break-all">
                      {team.discord}
                    </a>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      <JoinRequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        teamName={team.name}
        onSave={handleJoinRequest}
        isPending={isSendingRequest}
      />
    </div>
  );
}
