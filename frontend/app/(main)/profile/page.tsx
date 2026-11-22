'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { ProfileCard } from '@/features/profile/components/ProfileCard';
import {
  EditProfileModal,
  type ProfileFormValues,
} from '@/features/profile/components/EditProfileModal';
import { EventCard } from '@/features/events/components/EventCard';
import { TeamCard } from '@/features/teams/components/TeamCard';
import { EventPassModal } from '@/components/event-pass-modal';
import { ErrorState } from '@/components/error-state';
import { CalendarDays, UsersRound, Ticket, Sparkles, Plus } from 'lucide-react';
import { EventGridSkeleton } from '@/features/events/components/EventSkeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Event } from '@/types';

type ProfileTab = 'created' | 'interested' | 'squads' | 'passes';

export default function ProfilePage() {
  const { data, isLoading, isError, error, refetch, updateMutation } = useProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>('created');
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPassEvent, setSelectedPassEvent] = useState<Event | null>(null);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse pb-16">
        <div className="h-44 rounded-2xl bg-[#111114] border border-white/8" />
        <div className="h-8 w-64 bg-white/5 rounded" />
        <EventGridSkeleton count={3} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="pt-10">
        <ErrorState
          title="Could not load dossier"
          description={error?.message || 'There was a problem retrieving your profile record.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const { user, createdEvents, interestedEvents, createdTeams, joinedTeams } = data;
  const allSquads = [...createdTeams, ...joinedTeams];
  const allPassEvents = [...interestedEvents, ...createdEvents];

  const handleSave = (formData: ProfileFormValues) => {
    updateMutation.mutate(formData, {
      onSuccess: () => setEditOpen(false),
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Competitor Dossier Card */}
      <ProfileCard
        user={user}
        onEdit={() => setEditOpen(true)}
        stats={{
          createdEventsCount: createdEvents.length,
          interestedEventsCount: interestedEvents.length,
          squadsCount: allSquads.length,
        }}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { id: 'created', label: `CREATED DISPATCHES (${createdEvents.length})` },
          { id: 'interested', label: `INTERESTED EVENTS (${interestedEvents.length})` },
          { id: 'squads', label: `MY SQUADS (${allSquads.length})` },
          { id: 'passes', label: `DIGITAL PASSES (${allPassEvents.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ProfileTab)}
            className={`relative px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'text-[#FF4D00]' : 'text-[#8A8A93] hover:text-[#F4F4F0]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeProfileTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF4D00] shadow-[0_0_8px_#FF4D00]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {/* TAB 1: CREATED DISPATCHES */}
        {activeTab === 'created' && (
          <div>
            {createdEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {createdEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-xl bg-[#111114] border border-dashed border-white/10 text-center space-y-3">
                <CalendarDays className="w-8 h-8 text-[#8A8A93] mx-auto" />
                <h3 className="text-sm font-heading font-bold text-[#F4F4F0] uppercase">
                  NO CREATED DISPATCHES
                </h3>
                <p className="text-xs text-[#8A8A93] max-w-xs mx-auto">
                  You haven&apos;t hosted any university events yet.
                </p>
                <Button asChild size="sm" className="h-8 font-mono text-xs bg-[#FF4D00] text-white">
                  <Link href="/events/create">HOST AN EVENT</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERESTED EVENTS */}
        {activeTab === 'interested' && (
          <div>
            {interestedEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {interestedEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-xl bg-[#111114] border border-dashed border-white/10 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-[#8A8A93] mx-auto" />
                <h3 className="text-sm font-heading font-bold text-[#F4F4F0] uppercase">
                  NO INTERESTED DISPATCHES
                </h3>
                <p className="text-xs text-[#8A8A93] max-w-xs mx-auto">
                  You haven&apos;t declared intent for any upcoming events yet.
                </p>
                <Button asChild size="sm" variant="outline" className="h-8 font-mono text-xs border-white/15 text-[#F4F4F0]">
                  <Link href="/events">EXPLORE EVENTS</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SQUADS */}
        {activeTab === 'squads' && (
          <div>
            {allSquads.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allSquads.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-xl bg-[#111114] border border-dashed border-white/10 text-center space-y-3">
                <UsersRound className="w-8 h-8 text-[#8A8A93] mx-auto" />
                <h3 className="text-sm font-heading font-bold text-[#F4F4F0] uppercase">
                  NO ACTIVE SQUADS
                </h3>
                <p className="text-xs text-[#8A8A93] max-w-xs mx-auto">
                  You aren&apos;t enrolled in any competitive teams yet.
                </p>
                <Button asChild size="sm" variant="outline" className="h-8 font-mono text-xs border-white/15 text-[#F4F4F0]">
                  <Link href="/events">FIND SQUADS</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DIGITAL PASSES */}
        {activeTab === 'passes' && (
          <div>
            {allPassEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allPassEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-5 rounded-xl bg-[#111114] border border-white/10 space-y-4 hover:border-[#FF4D00]/40 transition-colors shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FF4D00]/15 text-[#FF4D00] border border-[#FF4D00]/30 font-semibold">
                        {ev.category} // PASS
                      </span>
                      <h4 className="text-base font-heading font-bold text-[#F4F4F0] line-clamp-1">
                        {ev.title}
                      </h4>
                      <p className="text-xs font-mono text-[#8A8A93]">
                        ISSUED TO: {user.name}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => setSelectedPassEvent(ev)}
                      className="w-full h-9 font-mono text-xs uppercase tracking-wider bg-[#18181E] border border-white/15 hover:border-[#C8FF00] text-[#F4F4F0] gap-2 font-bold"
                    >
                      <Ticket className="w-4 h-4 text-[#C8FF00]" />
                      LAUNCH 3D PASS
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-xl bg-[#111114] border border-dashed border-white/10 text-center space-y-3">
                <Ticket className="w-8 h-8 text-[#8A8A93] mx-auto" />
                <h3 className="text-sm font-heading font-bold text-[#F4F4F0] uppercase">
                  NO DIGITAL PASSES ISSUED
                </h3>
                <p className="text-xs text-[#8A8A93] max-w-xs mx-auto">
                  Digital Swiss Boarding passes are automatically issued when you show interest or join a team.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
        onSave={handleSave}
        isPending={updateMutation.isPending}
      />

      {/* 3D Ticket Pass Modal */}
      {selectedPassEvent && (
        <EventPassModal
          open={!!selectedPassEvent}
          onClose={() => setSelectedPassEvent(null)}
          event={selectedPassEvent}
          user={user}
        />
      )}
    </div>
  );
}
