'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  CheckCircle2,
  Ticket,
  Users,
  UsersRound,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import { CATEGORY_CONFIG, EVENT_TYPE_CONFIG } from '../utils';
import { EventCoverArt } from '@/components/ui/event-cover-art';
import { LiveCountdown } from '@/components/ui/live-countdown';
import { EventPassModal } from '@/components/event-pass-modal';
import { InterestedModal } from './InterestedModal';
import { useMarkInterested } from '../hooks/useMarkInterested';
import { useAuth } from '@/hooks/useAuth';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
  isSpotlight?: boolean;
}

export function EventCard({ event, isSpotlight = false }: EventCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const { mutateAsync, isPending } = useMarkInterested(event.id);

  const catConfig = CATEGORY_CONFIG[event.category] ?? CATEGORY_CONFIG.other;
  const typeConfig = EVENT_TYPE_CONFIG[event.eventType] ?? EVENT_TYPE_CONFIG.offline;

  // Extract explicit counts (fixing the undefined counter bug)
  const interestedCount = event._count?.interests ?? event.interestedCount ?? 0;
  const teamCount = event._count?.teams ?? event.teamCount ?? 0;

  const handleInterestSubmit = async (interestText: string) => {
    await mutateAsync(interestText);
    setInterestModalOpen(false);
  };

  // SPOTLIGHT HERO VARIANT (for top soonest event)
  if (isSpotlight) {
    return (
      <>
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="group relative rounded-2xl overflow-hidden bg-[#111114] border border-white/12 hover:border-[#FF4D00]/50 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col lg:flex-row"
        >
          {/* Visual Cover Art Area */}
          <div className="relative lg:w-1/2 h-64 sm:h-80 lg:h-auto overflow-hidden">
            <EventCoverArt
              id={event.id}
              category={event.category}
              bannerUrl={event.bannerImage}
              className="w-full h-full min-h-[260px]"
            />
            {/* Spotlight Flag */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#FF4D00] text-white text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_12px_#FF4D00]">
                SPOTLIGHT // NEXT DISPATCH
              </span>
              <span className="px-2 py-1 rounded bg-[#09090B]/90 border border-white/15 text-[10px] font-mono text-[#F4F4F0] uppercase font-semibold">
                {catConfig.label}
              </span>
            </div>

            {/* Countdown floating badge */}
            <div className="absolute bottom-3.5 left-3.5">
              <LiveCountdown deadline={event.registrationDeadline} variant="badge" />
            </div>
          </div>

          {/* Metadata & Actions Area */}
          <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A93]">
                <CalendarDays className="w-3.5 h-3.5 text-[#FF4D00]" />
                <span className="text-[#F4F4F0] font-semibold">{formatDate(event.eventDate)}</span>
                <span>//</span>
                <span className="uppercase">{typeConfig.label}</span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-black tracking-tight text-[#F4F4F0] group-hover:text-[#FF4D00] transition-colors leading-tight">
                {event.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#8A8A93] line-clamp-3 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Tactical stats row */}
            <div className="pt-3 border-t border-white/8 flex items-center gap-6 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF4D00]" />
                <span className="font-bold text-[#F4F4F0]">
                  {String(interestedCount).padStart(2, '0')}
                </span>
                <span className="text-[#8A8A93] uppercase">Interested</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersRound className="w-4 h-4 text-[#C8FF00]" />
                <span className="font-bold text-[#F4F4F0]">
                  {String(teamCount).padStart(2, '0')}
                </span>
                <span className="text-[#8A8A93] uppercase">Squads</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <Button
                asChild
                className="h-10 px-5 font-mono text-xs uppercase tracking-wider bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-bold gap-2 shadow-[0_4px_20px_rgba(255,77,0,0.3)]"
              >
                <Link href={`/events/${event.id}`}>
                  Inspect Event
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button
                variant="outline"
                onClick={() => setPassModalOpen(true)}
                className="h-10 px-4 font-mono text-xs uppercase tracking-wider border-white/15 bg-[#18181E] text-[#F4F4F0] hover:border-white/30 gap-2"
              >
                <Ticket className="w-4 h-4 text-[#C8FF00]" />
                Event Pass
              </Button>

              {isAuthenticated && (
                event.isInterested ? (
                  <Button
                    disabled
                    variant="ghost"
                    className="h-10 text-xs font-mono text-[#C8FF00] bg-[#C8FF00]/10 gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Interested
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setInterestModalOpen(true)}
                    className="h-10 text-xs font-mono border-white/15 hover:border-[#FF4D00] text-[#F4F4F0]"
                  >
                    Want To Go
                  </Button>
                )
              )}
            </div>
          </div>
        </motion.div>

        <InterestedModal
          open={interestModalOpen}
          onClose={() => setInterestModalOpen(false)}
          onSubmit={handleInterestSubmit}
          isPending={isPending}
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

  // TICKET STUB VARIANT (Standard Grid)
  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="group relative rounded-xl overflow-hidden bg-[#111114] border border-white/8 hover:border-white/20 transition-all duration-300 flex flex-col shadow-lg"
      >
        {/* Cover Art Area */}
        <div className="relative h-44 overflow-hidden shrink-0">
          <EventCoverArt
            id={event.id}
            category={event.category}
            bannerUrl={event.bannerImage}
            className="w-full h-full"
          />

          {/* Micro Category & Type Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-[#09090B]/90 border border-white/15 text-[10px] font-mono font-bold uppercase text-[#F4F4F0]">
              {catConfig.label}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#09090B]/90 border border-white/10 text-[10px] font-mono text-[#8A8A93] uppercase">
              {typeConfig.label}
            </span>
          </div>

          {/* Top Right: Countdown Pill */}
          <div className="absolute top-2.5 right-2.5">
            <LiveCountdown deadline={event.registrationDeadline} />
          </div>
        </div>

        {/* Perforated Divider Bar */}
        <div className="relative flex items-center justify-between w-full h-0 border-t border-dashed border-white/15">
          <div className="w-3.5 h-3.5 rounded-full bg-[#09090B] -translate-x-1/2 shadow-inner border border-white/10" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#09090B] translate-x-1/2 shadow-inner border border-white/10" />
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8A8A93]">
              <CalendarDays className="w-3 h-3 text-[#FF4D00]" />
              <span>{formatDate(event.eventDate)}</span>
            </div>

            <h3 className="text-base font-heading font-bold text-[#F4F4F0] group-hover:text-[#FF4D00] transition-colors leading-snug line-clamp-2">
              {event.title}
            </h3>

            <p className="text-xs text-[#8A8A93] line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Numeric Counts Pill */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8A8A93]">
            <span className="flex items-center gap-1 text-[#F4F4F0]">
              <Users className="w-3 h-3 text-[#FF4D00]" />
              {String(interestedCount).padStart(2, '0')}{' '}
              <span className="text-[#8A8A93]">INTERESTED</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#F4F4F0]">
              <UsersRound className="w-3 h-3 text-[#C8FF00]" />
              {String(teamCount).padStart(2, '0')}{' '}
              <span className="text-[#8A8A93]">SQUADS</span>
            </span>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs font-mono uppercase tracking-wider border-white/10 bg-[#18181E] text-[#F4F4F0] hover:border-white/20 hover:bg-white/5"
            >
              <Link href={`/events/${event.id}`}>
                View Details
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => setPassModalOpen(true)}
              title="View Digital Ticket Pass"
              aria-label="View Digital Ticket Pass"
              className="h-8 px-2.5 rounded-md border border-white/10 bg-[#18181E] text-[#8A8A93] hover:text-[#C8FF00] hover:border-[#C8FF00]/40 transition-colors flex items-center justify-center"
            >
              <Ticket className="w-3.5 h-3.5" />
            </button>

            {isAuthenticated && (
              event.isInterested ? (
                <div
                  title="You marked interest"
                  className="h-8 px-2.5 rounded-md bg-[#C8FF00]/10 border border-[#C8FF00]/30 text-[#C8FF00] flex items-center justify-center"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setInterestModalOpen(true)}
                  className="h-8 px-2.5 rounded-md border border-white/10 bg-[#18181E] text-xs font-mono text-[#FF4D00] hover:bg-[#FF4D00]/10 hover:border-[#FF4D00]/30 transition-colors"
                >
                  Join
                </button>
              )
            )}
          </div>
        </div>
      </motion.div>

      <InterestedModal
        open={interestModalOpen}
        onClose={() => setInterestModalOpen(false)}
        onSubmit={handleInterestSubmit}
        isPending={isPending}
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
