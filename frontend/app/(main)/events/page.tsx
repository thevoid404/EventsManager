'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/features/events/hooks/useEvents';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/hooks/useAuth';
import { SearchBar } from '@/features/events/components/SearchBar';
import { CategoryFilter } from '@/features/events/components/CategoryFilter';
import { EventCard } from '@/features/events/components/EventCard';
import { EventGridSkeleton } from '@/features/events/components/EventSkeleton';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { cn } from '@/lib/utils';
import type { EventCategory } from '@/types';

type SortOption = 'deadline' | 'eventDate' | 'createdAt';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'deadline', label: 'Deadline' },
  { value: 'eventDate', label: 'Event Date' },
  { value: 'createdAt', label: 'Newest' },
];

export default function EventsPage() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<EventCategory | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>('deadline');

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError, refetch } = useEvents({
    search: debouncedSearch || undefined,
    category,
    sortBy,
  });

  const events = data?.data ?? [];
  const total = data?.total ?? 0;
  const hasFilters = !!search || !!category;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Upcoming Events</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Discover and join university events
          </p>
        </div>
        {isAuthenticated && (
          <Button asChild size="sm" className="gap-1.5 shrink-0">
            <Link href="/events/create">
              <Plus className="h-3.5 w-3.5" />
              Create Event
            </Link>
          </Button>
        )}
      </div>

      {/* Filters row */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="w-full sm:w-64">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-0.5 border border-border rounded-md p-0.5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSortBy(opt.value)}
                className={cn(
                  'px-3 py-1 text-xs rounded transition-colors',
                  sortBy === opt.value
                    ? 'bg-foreground text-background font-medium'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>

      {/* Content */}
      {isLoading ? (
        <EventGridSkeleton count={6} />
      ) : isError ? (
        <ErrorState
          description="Could not load events. Check your connection and try again."
          onRetry={() => refetch()}
        />
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={hasFilters ? 'No events found' : 'No events yet'}
          description={
            hasFilters
              ? 'Try adjusting your search or clearing the filters.'
              : 'No events have been posted yet. Be the first to create one!'
          }
          action={
            !hasFilters && isAuthenticated ? (
              <Button asChild size="sm">
                <Link href="/events/create">Create an event</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center pb-2">
            Showing {events.length}{total > events.length ? ` of ${total}` : ''} events
          </p>
        </div>
      )}
    </div>
  );
}
