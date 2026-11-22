'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTeam } from '@/features/teams/hooks/useTeam';
import { useJoinRequest } from '@/features/teams/hooks/useJoinRequest';
import { TeamJoinRequests } from './TeamJoinRequests';
import { ErrorState } from '@/components/error-state';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Users,
  Shield,
  MessageCircle,
  Info,
  Sparkles,
  ExternalLink,
  Send,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function TeamDetailView({ teamId }: { teamId: string }) {
  const { user, isAuthenticated } = useAuth();
  const { data: team, isLoading, isError, refetch } = useTeam(teamId);
  const { mutateAsync: sendRequest, isPending: isSendingRequest } = useJoinRequest(teamId);
  const [intro, setIntro] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse pb-16">
        <div className="h-4 w-32 bg-white/10 rounded" />
        <div className="h-44 rounded-2xl bg-[#111114] border border-white/8" />
        <div className="h-72 rounded-2xl bg-[#111114] border border-white/8" />
      </div>
    );
  }

  if (isError || !team) {
    return (
      <div className="pt-10">
        <ErrorState
          description="Could not load squad telemetry record."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const currentCount = team.members?.length ?? team.currentMembers ?? 1;
  const maxCount = team.maxMembers ?? 4;
  const isFull = currentCount >= maxCount;
  const openSlots = Math.max(0, maxCount - currentCount);

  const isCurrentUserMember =
    team.isCurrentUserMember ||
    team.members?.some((m) => m.userId === user?.id) ||
    team.leaderId === user?.id;

  const isLeader =
    team.isCurrentUserLeader ||
    team.leaderId === user?.id;

  const canJoin = isAuthenticated && !isCurrentUserMember && !isFull;

  const handleJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendRequest({ introduction: intro });
      toast.success('Transmission dispatched // Request sent to squad captain');
      setShowJoinForm(false);
      setIntro('');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to submit join request.';
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <Link
        href={`/events/${team.eventId}`}
        className="inline-flex items-center gap-2 text-xs font-mono text-[#8A8A93] hover:text-[#FF4D00] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        BACK TO EVENT DISPATCH
      </Link>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#111114] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8FF00] shadow-[0_0_10px_#C8FF00]" />
            <span className="text-[10px] font-mono tracking-widest text-[#8A8A93] uppercase">
              CONFIRMED SQUAD PROTOCOL
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-[#F4F4F0] uppercase">
            {team.name}
          </h1>

          <div className="flex items-center gap-3 text-xs font-mono text-[#8A8A93]">
            <span>CAPTAIN: <strong className="text-[#FF4D00]">{team.leaderName || 'Leader'}</strong></span>
            <span>·</span>
            <span className={isFull ? 'text-[#FF2E4C] font-bold' : 'text-[#C8FF00] font-bold'}>
              {currentCount} / {maxCount} ({isFull ? 'SQUAD FULL' : `${openSlots} SLOTS OPEN`})
            </span>
          </div>

          {/* Visual Slot Pips */}
          <div className="flex items-center gap-1.5 max-w-xs pt-1">
            {Array.from({ length: maxCount }).map((_, i) => {
              const filled = i < currentCount;
              return (
                <div
                  key={i}
                  className={`h-2.5 flex-1 rounded-sm border ${
                    filled
                      ? 'bg-[#C8FF00] border-[#C8FF00] shadow-[0_0_6px_rgba(200,255,0,0.4)]'
                      : 'bg-white/5 border-white/10'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* CTA Area */}
        <div className="shrink-0 flex gap-3">
          {isCurrentUserMember ? (
            <div className="px-4 py-2 rounded-lg bg-[#C8FF00]/10 border border-[#C8FF00]/30 text-xs font-mono text-[#C8FF00] font-bold flex items-center gap-2">
              <Shield className="w-4 h-4" />
              CONFIRMED OPERATIVE
            </div>
          ) : canJoin ? (
            <Button
              onClick={() => setShowJoinForm(true)}
              className="h-10 px-5 font-mono text-xs uppercase bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-bold gap-2 shadow-[0_4px_20px_rgba(255,77,0,0.3)]"
            >
              <Send className="w-4 h-4" />
              Request to Join ({openSlots} Left)
            </Button>
          ) : isFull ? (
            <div className="px-4 py-2 rounded-lg bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 text-xs font-mono text-[#FF2E4C] font-bold">
              ROSTER AT CAPACITY
            </div>
          ) : !isAuthenticated ? (
            <Button asChild className="h-10 px-5 font-mono text-xs uppercase bg-[#FF4D00] text-white font-bold">
              <Link href="/login">Sign In with @seu.edu.bd to Join</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {/* Join Request Inline Form (if clicked) */}
      {showJoinForm && (
        <form onSubmit={handleJoinRequest} className="p-6 rounded-2xl bg-[#141418] border border-[#FF4D00]/40 space-y-4 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-sm font-heading font-bold text-[#F4F4F0] uppercase">
              TRANSMIT JOIN REQUEST TO CAPTAIN
            </h3>
            <p className="text-xs text-[#8A8A93]">
              State your role, technical skills, or past competition experience.
            </p>
          </div>

          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={3}
            placeholder="e.g. 3rd year CSE student, skilled in React & Tailwind, participated in 2 hackathons..."
            className="w-full p-3 text-xs font-mono bg-[#09090B] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00]"
          />

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowJoinForm(false)}
              className="font-mono text-xs border-white/10 text-[#8A8A93]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSendingRequest}
              className="font-mono text-xs uppercase bg-[#FF4D00] text-white font-bold gap-1.5"
            >
              {isSendingRequest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Send Transmission
            </Button>
          </div>
        </form>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Desired Specialty */}
          <div className="p-6 rounded-xl bg-[#111114] border border-white/8 space-y-2">
            <div className="text-[10px] font-mono text-[#8A8A93] uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#FF4D00]" />
              DESIRED SKILLS / LOOKING FOR
            </div>
            <p className="text-sm font-mono text-[#F4F4F0]">
              {team.lookingFor}
            </p>
          </div>

          {/* Mission Description */}
          <div className="p-6 rounded-xl bg-[#111114] border border-white/8 space-y-2">
            <div className="text-[10px] font-mono text-[#8A8A93] uppercase tracking-wider">
              MISSION BRIEFING &amp; GOALS
            </div>
            <p className="text-xs sm:text-sm font-sans text-[#8A8A93] leading-relaxed whitespace-pre-wrap">
              {team.description}
            </p>
          </div>

          {/* Confirmed Operatives Roster */}
          <div className="p-6 rounded-xl bg-[#111114] border border-white/8 space-y-4">
            <div className="text-[10px] font-mono text-[#8A8A93] uppercase tracking-wider">
              CONFIRMED SQUAD OPERATIVES ({team.members?.length ?? 0})
            </div>
            <div className="space-y-2.5">
              {team.members && team.members.length > 0 ? (
                team.members.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-lg bg-[#18181E] border border-white/8 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="w-8 h-8 rounded border border-white/10 shrink-0">
                        <AvatarFallback className="bg-white/10 text-xs font-mono font-bold text-[#F4F4F0] rounded">
                          {member.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs font-heading font-bold text-[#F4F4F0] truncate flex items-center gap-1.5">
                          {member.name}
                          {member.isLeader && (
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/40">
                              CAPTAIN
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] font-mono text-[#8A8A93] truncate">
                          {member.department}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs font-mono text-[#8A8A93]">No members yet.</div>
              )}
            </div>
          </div>

          {/* Leader Approval Queue */}
          {isLeader && (
            <div className="p-6 rounded-xl bg-[#141418] border border-[#FF4D00]/30 space-y-4">
              <div className="text-xs font-mono font-bold text-[#FF4D00] uppercase flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                CAPTAIN QUEUE // PENDING APPLICANTS
              </div>
              <TeamJoinRequests teamId={team.id} />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Contact Channels (Visible to members) */}
          {isCurrentUserMember ? (
            <div className="p-6 rounded-xl bg-[#111114] border border-white/8 space-y-4">
              <div className="text-[10px] font-mono text-[#8A8A93] uppercase tracking-wider flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#C8FF00]" />
                COMMUNICATION CHANNELS
              </div>
              <div className="space-y-2 text-xs font-mono">
                {team.whatsapp && (
                  <a
                    href={team.whatsapp.startsWith('http') ? team.whatsapp : `https://wa.me/${team.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded bg-[#18181E] border border-white/5 hover:border-white/20 text-[#25D366] transition-colors"
                  >
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {team.facebook && (
                  <a
                    href={team.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded bg-[#18181E] border border-white/5 hover:border-white/20 text-[#1877F2] transition-colors"
                  >
                    <span>Facebook Squad</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {team.discord && (
                  <a
                    href={team.discord}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded bg-[#18181E] border border-white/5 hover:border-white/20 text-[#5865F2] transition-colors"
                  >
                    <span>Discord Comms</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[#111114] border border-dashed border-white/10 text-center space-y-2">
              <Shield className="w-6 h-6 text-[#8A8A93] mx-auto" />
              <div className="text-xs font-mono text-[#8A8A93] uppercase">
                COMMS ENCRYPTED
              </div>
              <p className="text-[11px] text-[#8A8A93]">
                Direct WhatsApp, Facebook, and Discord channels are disclosed once accepted into this squad.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
