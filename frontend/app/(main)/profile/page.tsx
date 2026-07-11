'use client';

import { useState } from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { ProfileCard } from '@/features/profile/components/ProfileCard';
import {
  EditProfileModal,
  type ProfileFormValues,
} from '@/features/profile/components/EditProfileModal';
import { SectionHeader } from '@/components/section-header';
import { EventCard } from '@/features/events/components/EventCard';
import { TeamCard } from '@/features/teams/components/TeamCard';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { CalendarDays, UsersRound } from 'lucide-react';
import { EventGridSkeleton } from '@/features/events/components/EventSkeleton';

export default function ProfilePage() {
  const { data, isLoading, isError, error, refetch, updateMutation } = useProfile();
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="h-32 rounded-xl border border-border bg-muted animate-pulse" />
        <div className="space-y-4">
          <SectionHeader title="Created Events" />
          <EventGridSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="pt-10">
        <ErrorState
          title="Could not load profile"
          description={error?.message || 'There was a problem loading your profile data.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const { user, createdEvents, interestedEvents, createdTeams, joinedTeams } = data;

  const handleSave = (formData: ProfileFormValues) => {
    updateMutation.mutate(formData, {
      onSuccess: () => setEditOpen(false),
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Profile Header */}
      <div>
        <h1 className="text-xl font-semibold mb-6">My Profile</h1>
        <ProfileCard user={user} onEdit={() => setEditOpen(true)} />
      </div>

      {/* Events Section */}
      <div className="space-y-8">
        <section>
          <SectionHeader title="Created Events" className="mb-4" />
          {createdEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No created events"
              description="You haven't hosted any events yet."
              className="py-10 border border-dashed rounded-lg"
            />
          )}
        </section>

        <section>
          <SectionHeader title="Interested Events" className="mb-4" />
          {interestedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {interestedEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No interested events"
              description="You haven't shown interest in any events."
              className="py-10 border border-dashed rounded-lg"
            />
          )}
        </section>
      </div>

      {/* Teams Section */}
      <div className="space-y-8">
        <section>
          <SectionHeader title="Created Teams" className="mb-4" />
          {createdTeams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UsersRound}
              title="No created teams"
              description="You haven't formed any teams yet."
              className="py-10 border border-dashed rounded-lg"
            />
          )}
        </section>

        <section>
          <SectionHeader title="Joined Teams" className="mb-4" />
          {joinedTeams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UsersRound}
              title="No joined teams"
              description="You aren't a member of any teams yet."
              className="py-10 border border-dashed rounded-lg"
            />
          )}
        </section>
      </div>

      {/* Modals */}
      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
        onSave={handleSave}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
