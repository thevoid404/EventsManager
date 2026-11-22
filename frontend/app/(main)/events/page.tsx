'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Radio, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/features/events/hooks/useEvents';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/hooks/useAuth';
import { SearchBar } from '@/features/events/components/SearchBar';
import { CategoryFilter } from '@/features/events/components/CategoryFilter';
import { EventCard } from '@/features/events/components/EventCard';
import { EventGridSkeleton } from '@/features/events/components/EventSkeleton';
import { ErrorState } from '@/components/error-state';
import { cn } from '@/lib/utils';
import type { EventCategory } from '@/types';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 360, damping: 28 },
  },
};

type SortOption = 'deadline' | 'eventDate' | 'createdAt';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'deadline', label: 'DEADLINE' },
  { value: 'eventDate', label: 'EVENT DATE' },
  { value: 'createdAt', label: 'NEWEST' },
];

export default function EventsPage() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<EventCategory | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>('deadline');

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, refetch } = useEvents({
    search: debouncedSearch || undefined,
    category,
    sortBy,
  });

  const events = data?.data ?? [];
  const total = data?.total ?? 0;
  const hasFilters = !!search || !!category;

  const spotlightEvent = !hasFilters && events.length > 0 ? events[0] : null;
  const remainingEvents = spotlightEvent ? events.slice(1) : events;

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Masthead */}
      <div className="relative rounded-2xl border border-white/10 bg-[#111114] p-6 sm:p-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Subtle architectural grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#FF4D00]/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#FF4D00]/10 border border-[#FF4D00]/25 text-[#FF4D00] text-[10px] font-mono tracking-widest uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-ping" />
              SOUTHEAST UNIVERSITY // TELEMETRY
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tighter text-[#F4F4F0] uppercase">
              CAMPUS DISPATCH
            </h1>

            <p className="text-xs sm:text-sm text-[#8A8A93] font-sans leading-relaxed">
              Tactical directory of upcoming hackathons, programming arenas, academic symposiums, and team recruitment pipelines across Southeast University.
            </p>
          </div>

          {/* Right side live status stats */}
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 shrink-0">
            <div>
              <div className="text-[10px] font-mono text-[#8A8A93] uppercase">ACTIVE DISPATCHES</div>
              <div className="text-2xl font-mono font-bold text-[#C8FF00]">
                {String(total).padStart(2, '0')}
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div>
              <div className="text-[10px] font-mono text-[#8A8A93] uppercase">STATUS</div>
              <div className="text-xs font-mono font-bold text-[#FF4D00] flex items-center gap-1.5 mt-1">
                <Radio className="w-3 h-3 animate-pulse" />
                BROADCASTING
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="w-full sm:max-w-md">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-1 bg-[#111114] border border-white/10 rounded-lg p-1 shrink-0">
            <span className="text-[10px] font-mono text-[#8A8A93] px-2 uppercase flex items-center gap-1">
              <Filter className="w-3 h-3" />
              SORT:
            </span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSortBy(opt.value)}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-mono rounded transition-colors uppercase font-medium',
                  sortBy === opt.value
                    ? 'bg-[#FF4D00] text-white shadow-sm font-semibold'
                    : 'text-[#8A8A93] hover:text-[#F4F4F0]'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>

      {/* Content Area */}
      {isLoading ? (
        <EventGridSkeleton count={6} />
      ) : isError ? (
        <ErrorState
          description="Failed to pull active event dispatches from the server."
          onRetry={() => refetch()}
        />
      ) : events.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#111114]/60 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-[#8A8A93]">
            <Sparkles className="w-5 h-5 text-[#FF4D00]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-heading font-bold text-[#F4F4F0] uppercase tracking-wide">
              {hasFilters ? 'NO MATCHING DISPATCHES FOUND' : 'NO ACTIVE EVENTS RECORDED'}
            </h3>
            <p className="text-xs text-[#8A8A93] max-w-sm mx-auto">
              {hasFilters
                ? 'Try broadening your search parameters or clearing category filters.'
                : 'No campus events have been broadcast yet. Be the first to initiate one.'}
            </p>
          </div>
          {hasFilters ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setCategory(undefined);
              }}
              className="h-8 font-mono text-xs border-white/15 text-[#F4F4F0] gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              RESET FILTERS
            </Button>
          ) : isAuthenticated ? (
            <Button asChild size="sm" className="h-8 font-mono text-xs bg-[#FF4D00] text-white">
              <Link href="/events/create">HOST AN EVENT</Link>
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Spotlight Hero (if not filtering) */}
          {spotlightEvent && (
            <div className="space-y-2">
              <div className="text-[10px] font-mono tracking-widest text-[#8A8A93] uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF4D00]" />
                PRIORITY TRANSMISSION // NEXT UPCOMING
              </div>
              <EventCard event={spotlightEvent} isSpotlight={true} />
            </div>
          )}

          {/* Remaining Grid of Ticket Stubs */}
          {remainingEvents.length > 0 && (
            <div className="space-y-3">
              {spotlightEvent && (
                <div className="text-[10px] font-mono tracking-widest text-[#8A8A93] uppercase">
                  DISPATCH DIRECTORY ({remainingEvents.length})
                </div>
              )}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {remainingEvents.map((event) => (
                  <motion.div key={event.id} variants={itemVariants}>
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          <div className="pt-4 text-center">
            <span className="font-mono text-[10px] text-[#8A8A93] uppercase tracking-widest">
              END OF CAMPUS DISPATCH // {events.length} OF {total} BROADCASTS LOADED
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
