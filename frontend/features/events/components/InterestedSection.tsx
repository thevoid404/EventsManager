'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { InterestedUserCard } from './InterestedUserCard';
import { useInterestedUsers } from '../hooks/useInterestedUsers';

interface InterestedSectionProps {
  eventId: string;
  interestedCount: number;
}

export function InterestedSection({
  eventId,
  interestedCount,
}: InterestedSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: users, isLoading } = useInterestedUsers(eventId, isOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent/40 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            Interested{' '}
            <span className="text-muted-foreground font-normal">
              ({interestedCount})
            </span>
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Expandable body */}
      {isOpen && (
        <div className="border-t border-border px-4">
          {isLoading ? (
            <div className="space-y-3 py-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : !users || users.length === 0 ? (
            <p className="text-sm text-muted-foreground py-5 text-center">
              No one has shown interest yet.
            </p>
          ) : (
            <div>
              {users.map((entry) => (
                <InterestedUserCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
