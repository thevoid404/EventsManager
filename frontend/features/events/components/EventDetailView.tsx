'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Users,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDate, getDeadlineLabel } from '@/lib/format';
import { CATEGORY_CONFIG, EVENT_TYPE_CONFIG } from '../utils';
import { InterestedModal } from './InterestedModal';
import { InterestedSection } from './InterestedSection';
import { ErrorState } from '@/components/error-state';
import { useEvent } from '../hooks/useEvent';
import { useMarkInterested } from '../hooks/useMarkInterested';
import { useAuth } from '@/hooks/useAuth';

interface EventDetailViewProps {
  id: string;
}

export function EventDetailView({ id }: EventDetailViewProps) {
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const { data: event, isLoading, isError, refetch } = useEvent(id);
  const { mutateAsync, isPending } = useMarkInterested(id);

  const handleInterest = async (interestText: string) => {
    await mutateAsync(interestText);
    setModalOpen(false);
  };

  if (isLoading) return <EventDetailSkeleton />;

  if (isError || !event) {
    return (
      <ErrorState
        description="Could not load this event. It may have been removed."
        onRetry={() => refetch()}
      />
    );
  }

  const catConfig = CATEGORY_CONFIG[event.category];
  const typeConfig = EVENT_TYPE_CONFIG[event.eventType];
  const deadline = getDeadlineLabel(event.registrationDeadline);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Events
      </Link>

      {/* Banner */}
      <div className="relative h-52 sm:h-72 rounded-xl overflow-hidden">
        {event.bannerImage ? (
          <Image
            src={event.bannerImage}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div
            className={cn(
              'h-full w-full bg-gradient-to-br',
              catConfig.gradient,
            )}
          />
        )}
      </div>

      {/* Header */}
      <div className="space-y-4">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              'text-xs font-medium px-2.5 py-1 rounded-full border',
              catConfig.badge,
              catConfig.border,
            )}
          >
            {catConfig.label}
          </span>
          <span
            className={cn(
              'text-xs font-medium px-2.5 py-1 rounded-full border',
              typeConfig.badge,
              typeConfig.border,
            )}
          >
            {typeConfig.label}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold leading-snug">{event.title}</h1>

        {/* Meta grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <span>
              Reg. deadline:{' '}
              <span
                className={cn(
                  'font-medium',
                  deadline.urgent ? 'text-destructive' : 'text-foreground',
                )}
              >
                {deadline.text}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>
              Event date:{' '}
              <span className="font-medium text-foreground">
                {formatDate(event.eventDate)}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" />
            <span>
              <span className="font-medium text-foreground">
                {event.interestedCount}
              </span>{' '}
              interested
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UsersRound className="h-4 w-4 shrink-0" />
            <span>
              <span className="font-medium text-foreground">
                {event.teamCount}
              </span>{' '}
              teams formed
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {event.registrationLink && (
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Register
              </a>
            </Button>
          )}

          {isAuthenticated &&
            (event.isInterested ? (
              <Button
                size="sm"
                variant="secondary"
                className="gap-1.5"
                disabled
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Interested ✓
              </Button>
            ) : (
              <Button size="sm" onClick={() => setModalOpen(true)}>
                Want To Go
              </Button>
            ))}
        </div>
      </div>

      <Separator />

      {/* Description */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold">About this event</h2>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {event.description}
        </p>
      </section>

      <Separator />

      {/* Interested users */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Interested People</h2>
        <InterestedSection
          eventId={id}
          interestedCount={event.interestedCount}
        />
      </section>

      <Separator />

      {/* Teams — placeholder until teams feature is built */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            Teams{' '}
            <span className="font-normal text-muted-foreground">
              ({event.teamCount})
            </span>
          </h2>
        </div>
        <div className="border border-dashed border-border rounded-lg p-8 text-center">
          <UsersRound className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {event.teamCount > 0
              ? `${event.teamCount} team${event.teamCount !== 1 ? 's' : ''} have been formed.`
              : 'No teams yet.'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Team management coming soon.
          </p>
        </div>
      </section>

      {/* Interest modal */}
      <InterestedModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleInterest}
        isPending={isPending}
      />
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

function EventDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-52 sm:h-72 rounded-xl w-full" />
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-8 w-2/3" />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
