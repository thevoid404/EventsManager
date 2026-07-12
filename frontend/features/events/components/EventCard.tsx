'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Users,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDate, getDeadlineLabel } from '@/lib/format';
import { CATEGORY_CONFIG, EVENT_TYPE_CONFIG } from '../utils';
import { InterestedModal } from './InterestedModal';
import { useMarkInterested } from '../hooks/useMarkInterested';
import { useAuth } from '@/hooks/useAuth';
import type { Event } from '@/types';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const { mutateAsync, isPending } = useMarkInterested(event.id);

  const catConfig = CATEGORY_CONFIG[event.category];
  const typeConfig = EVENT_TYPE_CONFIG[event.eventType];
  const deadline = getDeadlineLabel(event.registrationDeadline);

  const handleInterest = async (interestText: string) => {
    await mutateAsync(interestText);
    setModalOpen(false);
  };

  return (
    <>
      <motion.div
        layout
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="group border border-border/80 rounded-xl overflow-hidden bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col"
      >
        {/* Banner */}
        <div className="relative h-36 overflow-hidden shrink-0">
          {event.bannerImage ? (
            <Image
              src={event.bannerImage}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className={cn(
                'h-full w-full bg-gradient-to-br',
                catConfig.gradient,
              )}
            />
          )}

          {/* Overlay badges */}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/90 text-zinc-800">
              {catConfig.label}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/90 text-zinc-800">
              {typeConfig.label}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1 gap-3">
          {/* Title */}
          <h3 className="text-sm font-semibold leading-snug line-clamp-2">
            {event.title}
          </h3>

          {/* Date meta */}
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span
                className={cn(
                  deadline.urgent && 'text-destructive font-medium',
                )}
              >
                {deadline.text}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              <span>{formatDate(event.eventDate)}</span>
            </div>
          </div>

          {/* Counts */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {event.interestedCount} interested
            </span>
            <span className="flex items-center gap-1">
              <UsersRound className="h-3.5 w-3.5" />
              {event.teamCount} teams
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto pt-1">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs"
            >
              <Link href={`/events/${event.id}`}>View Details</Link>
            </Button>

            {isAuthenticated &&
              (event.isInterested ? (
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 h-8 text-xs gap-1.5"
                  disabled
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Interested
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => setModalOpen(true)}
                >
                  Want To Go
                </Button>
              ))}
          </div>
        </div>
      </motion.div>

      <InterestedModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleInterest}
        isPending={isPending}
      />
    </>
  );
}
