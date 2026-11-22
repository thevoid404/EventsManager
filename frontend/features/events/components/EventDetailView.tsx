'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Share2,
  Ticket,
  Users,
  UsersRound,
  Shield,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import { CATEGORY_CONFIG, EVENT_TYPE_CONFIG } from '../utils';
import { EventCoverArt } from '@/components/ui/event-cover-art';
import { LiveCountdown } from '@/components/ui/live-countdown';
import { CalendarExport } from '@/components/ui/calendar-export';
import { EventPassModal } from '@/components/event-pass-modal';
import { InterestedModal } from './InterestedModal';
import { InterestedUserCard } from './InterestedUserCard';
import { TeamCard } from '@/features/teams/components/TeamCard';
import { ErrorState } from '@/components/error-state';
import { useEvent } from '../hooks/useEvent';
import { useInterestedUsers } from '../hooks/useInterestedUsers';
import { useTeams } from '@/features/teams/hooks/useTeams';
import { useMarkInterested } from '../hooks/useMarkInterested';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface EventDetailViewProps {
  id: string;
}

type TabType = 'overview' | 'squads' | 'freeAgents';

export function EventDetailView({ id }: EventDetailViewProps) {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [passModalOpen, setPassModalOpen] = useState(false);

  const { data: event, isLoading, isError, refetch } = useEvent(id);
  const { data: teamsData, isLoading: teamsLoading } = useTeams(id);
  const { data: interestedUsers, isLoading: interestedLoading } = useInterestedUsers(id, true);
  const { mutateAsync: markInterest, isPending: isMarkingInterest } = useMarkInterested(id);

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (isError || !event) {
    return (
      <div className="pt-10">
        <ErrorState
          description="Could not load dispatch details. The event may be archived."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const catConfig = CATEGORY_CONFIG[event.category] ?? CATEGORY_CONFIG.other;
  const typeConfig = EVENT_TYPE_CONFIG[event.eventType] ?? EVENT_TYPE_CONFIG.offline;

  const teams = teamsData ?? event.teams ?? [];
  const interestedList = interestedUsers ?? [];

  // Identify all user IDs that are already in a team for this event
  const teamMemberUserIds = new Set<string>();
  teams.forEach((t) => {
    if (t.leaderId) teamMemberUserIds.add(t.leaderId);
    t.members?.forEach((m) => teamMemberUserIds.add(m.userId));
  });

  // Free agents: interested users who haven't joined a squad yet
  const freeAgents = interestedList.filter(
    (entry) => !teamMemberUserIds.has(entry.userId)
  );

  const interestedCount = event._count?.interests ?? event.interestedCount ?? interestedList.length;
  const teamCount = teams.length || (event._count?.teams ?? event.teamCount ?? 0);

  const handleInterestSubmit = async (text: string) => {
    try {
      await markInterest(text);
      toast.success('Interest registered // You are now listed as a Free Agent');
      setInterestModalOpen(false);
    } catch {
      toast.error('Failed to submit interest.');
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <>
      <div className="space-y-8 pb-16">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#8A8A93] hover:text-[#FF4D00] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            BACK TO CAMPUS DISPATCH
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8A8A93] hover:text-[#F4F4F0] px-3 py-1.5 rounded bg-[#111114] border border-white/10"
          >
            <Share2 className="w-3.5 h-3.5" />
            SHARE LINK
          </button>
        </div>

        {/* Top Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-[#111114] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <EventCoverArt
              id={event.id}
              category={event.category}
              bannerUrl={event.bannerImage}
              className="w-full h-full"
            />

            {/* Micro Tags */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#FF4D00] text-white text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_12px_#FF4D00]">
                {catConfig.tag}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#09090B]/90 border border-white/15 text-[10px] font-mono text-[#F4F4F0] uppercase font-semibold">
                {typeConfig.label}
              </span>
            </div>

            {/* Host Snippet */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#09090B]/85 backdrop-blur-md border border-white/10 text-xs font-mono text-[#8A8A93]">
                <Shield className="w-3.5 h-3.5 text-[#C8FF00]" />
                <span>
                  HOST: <strong className="text-[#F4F4F0]">{event.createdBy.name}</strong> ({event.createdBy.department})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Asymmetric 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Title, Tabs & Workspace (65% = 8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title Header */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#F4F4F0] uppercase leading-tight">
                {event.title}
              </h1>

              <div className="flex items-center gap-4 text-xs font-mono text-[#8A8A93] flex-wrap">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-[#FF4D00]" />
                  <span>{formatDate(event.eventDate)}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C8FF00]" />
                  <span>
                    {event.eventType === 'online' ? 'Online / Discord' : 'Southeast University Campus'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabbed Workspace Bar */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              {[
                { id: 'overview', label: 'OVERVIEW // RULES' },
                { id: 'squads', label: `SQUADS (${teamCount})` },
                { id: 'freeAgents', label: `FREE AGENTS (${freeAgents.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-colors ${
                    activeTab === tab.id ? 'text-[#FF4D00]' : 'text-[#8A8A93] hover:text-[#F4F4F0]'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeEventTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF4D00] shadow-[0_0_8px_#FF4D00]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="pt-2">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-[#111114] border border-white/8 space-y-4">
                    <h2 className="text-xs font-mono tracking-widest text-[#8A8A93] uppercase flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
                      EVENT BRIEFING & DETAILS
                    </h2>
                    <p className="text-sm font-sans text-[#F4F4F0] leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>

                  {/* Rules & Eligibility Snippet */}
                  <div className="p-6 rounded-xl bg-[#111114] border border-white/8 space-y-3">
                    <h3 className="text-xs font-mono tracking-widest text-[#8A8A93] uppercase">
                      ELIGIBILITY & SPECIFICATIONS
                    </h3>
                    <ul className="space-y-2 text-xs font-mono text-[#8A8A93]">
                      <li className="flex items-center gap-2">
                        <span className="text-[#C8FF00]">✔</span>
                        <span>Exclusively open to active Southeast University students.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#C8FF00]">✔</span>
                        <span>Verified student email (<strong className="text-[#F4F4F0]">@seu.edu.bd</strong>) required.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#C8FF00]">✔</span>
                        <span>Digital pass generated upon squad confirmation or declared intent.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: SQUADS */}
              {activeTab === 'squads' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-heading font-bold text-[#F4F4F0]">
                        Formed Squads
                      </h2>
                      <p className="text-xs text-[#8A8A93]">
                        Join an existing roster or recruit teammates for your own squad.
                      </p>
                    </div>

                    {isAuthenticated && (
                      <Button
                        asChild
                        size="sm"
                        className="h-8 font-mono text-xs uppercase bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-bold gap-1.5"
                      >
                        <Link href={`/events/${event.id}/teams/create`}>
                          <Plus className="w-3.5 h-3.5" />
                          Form Squad
                        </Link>
                      </Button>
                    )}
                  </div>

                  {teamsLoading ? (
                    <div className="py-12 text-center text-xs font-mono text-[#8A8A93]">
                      Loading tactical squads...
                    </div>
                  ) : teams.length === 0 ? (
                    <div className="p-12 rounded-xl bg-[#111114] border border-dashed border-white/10 text-center space-y-3">
                      <UsersRound className="w-8 h-8 text-[#8A8A93] mx-auto" />
                      <div className="space-y-1">
                        <h3 className="text-sm font-heading font-bold text-[#F4F4F0] uppercase">
                          NO SQUADS FORMED YET
                        </h3>
                        <p className="text-xs text-[#8A8A93] max-w-xs mx-auto">
                          Be the first captain to establish a squad and start recruiting fellow students.
                        </p>
                      </div>
                      {isAuthenticated && (
                        <Button asChild size="sm" className="h-8 font-mono text-xs bg-[#FF4D00] text-white font-bold">
                          <Link href={`/events/${event.id}/teams/create`}>
                            CREATE FIRST SQUAD
                          </Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {teams.map((team) => (
                        <TeamCard key={team.id} team={team} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: FREE AGENTS */}
              {activeTab === 'freeAgents' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-heading font-bold text-[#F4F4F0]">
                        Available Free Agents ({freeAgents.length})
                      </h2>
                      <p className="text-xs text-[#8A8A93]">
                        Students seeking squad captains and recruitment invitations.
                      </p>
                    </div>

                    {isAuthenticated && !event.isInterested && (
                      <Button
                        size="sm"
                        onClick={() => setInterestModalOpen(true)}
                        className="h-8 font-mono text-xs uppercase bg-[#C8FF00] text-[#09090B] hover:bg-[#C8FF00]/90 font-bold gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Join Free Agent Pool
                      </Button>
                    )}
                  </div>

                  {interestedLoading ? (
                    <div className="py-12 text-center text-xs font-mono text-[#8A8A93]">
                      Loading competitor pool...
                    </div>
                  ) : freeAgents.length === 0 ? (
                    <div className="p-12 rounded-xl bg-[#111114] border border-dashed border-white/10 text-center space-y-3">
                      <Users className="w-8 h-8 text-[#8A8A93] mx-auto" />
                      <div className="space-y-1">
                        <h3 className="text-sm font-heading font-bold text-[#F4F4F0] uppercase">
                          NO SOLO FREE AGENTS RECORDED
                        </h3>
                        <p className="text-xs text-[#8A8A93] max-w-xs mx-auto">
                          Declare your interest to announce yourself as an available operative looking for a squad.
                        </p>
                      </div>
                      {isAuthenticated && !event.isInterested && (
                        <Button
                          size="sm"
                          onClick={() => setInterestModalOpen(true)}
                          className="h-8 font-mono text-xs bg-[#C8FF00] text-[#09090B] font-bold"
                        >
                          SIGNAL AVAILABILITY
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {freeAgents.map((entry) => (
                        <InterestedUserCard key={entry.id} entry={entry} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Action Card (35% = 4 cols) */}
          <div className="lg:col-span-4 sticky top-20 space-y-4">
            <div className="rounded-2xl bg-[#111114] border border-white/12 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
              {/* Live Ticking Countdown Clock */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono tracking-widest text-[#8A8A93] uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF4D00]" />
                  REGISTRATION WINDOW
                </div>
                <LiveCountdown deadline={event.registrationDeadline} variant="detailed" />
              </div>

              {/* Event Metadata Breakdown */}
              <div className="space-y-3 pt-3 border-t border-white/8 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#8A8A93]">REG DEADLINE:</span>
                  <span className="text-[#F4F4F0] font-semibold">
                    {formatDate(event.registrationDeadline)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A8A93]">EVENT DAY:</span>
                  <span className="text-[#C8FF00] font-semibold">
                    {formatDate(event.eventDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A8A93]">LOCATION:</span>
                  <span className="text-[#F4F4F0] font-semibold uppercase">
                    {event.eventType}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-3 border-t border-white/8">
                {/* Official Registration Link */}
                {event.registrationLink && (
                  <Button
                    asChild
                    className="w-full h-11 font-mono text-xs uppercase tracking-wider bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-bold gap-2 shadow-[0_4px_20px_rgba(255,77,0,0.3)]"
                  >
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Official Registration
                    </a>
                  </Button>
                )}

                {/* Form a Squad Button */}
                {isAuthenticated && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-10 font-mono text-xs uppercase tracking-wider border-white/15 bg-[#18181E] text-[#F4F4F0] hover:border-white/30 gap-2"
                  >
                    <Link href={`/events/${event.id}/teams/create`}>
                      <Plus className="w-4 h-4 text-[#FF4D00]" />
                      Establish a Squad
                    </Link>
                  </Button>
                )}

                {/* Want to Go / Free Agent Toggle */}
                {isAuthenticated && (
                  event.isInterested ? (
                    <Button
                      disabled
                      variant="ghost"
                      className="w-full h-10 font-mono text-xs text-[#C8FF00] bg-[#C8FF00]/10 border border-[#C8FF00]/20 gap-2 font-bold"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Listed as Free Agent
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setInterestModalOpen(true)}
                      className="w-full h-10 font-mono text-xs uppercase border-white/15 hover:border-[#C8FF00] text-[#F4F4F0]"
                    >
                      Declare Interest (Solo Free Agent)
                    </Button>
                  )
                )}

                {/* 3D Event Pass CTA */}
                <Button
                  variant="outline"
                  onClick={() => setPassModalOpen(true)}
                  className="w-full h-10 font-mono text-xs uppercase tracking-wider border-white/15 bg-[#18181E] text-[#F4F4F0] hover:border-white/30 gap-2"
                >
                  <Ticket className="w-4 h-4 text-[#C8FF00]" />
                  View 3D Digital Pass
                </Button>
              </div>

              {/* Calendar Export */}
              <div className="pt-2">
                <div className="text-[10px] font-mono text-[#8A8A93] uppercase mb-2">
                  EXPORT TELEMETRY
                </div>
                <CalendarExport event={event} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <InterestedModal
        open={interestModalOpen}
        onClose={() => setInterestModalOpen(false)}
        onSubmit={handleInterestSubmit}
        isPending={isMarkingInterest}
      />
      <EventPassModal
        open={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        event={event}
        user={user}
      />
    </>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse pb-16">
      <div className="h-4 w-36 bg-white/10 rounded" />
      <div className="h-72 w-full bg-[#111114] rounded-2xl border border-white/8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-10 w-3/4 bg-white/10 rounded" />
          <div className="h-4 w-1/2 bg-white/5 rounded" />
          <div className="h-40 bg-[#111114] rounded-xl border border-white/8" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-72 bg-[#111114] rounded-2xl border border-white/8" />
        </div>
      </div>
    </div>
  );
}
