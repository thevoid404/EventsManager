'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calendar,
  Plus,
  Bell,
  User,
  LogOut,
  Layers,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/features/events/hooks/useEvents';
import { EventCategory } from '@/types';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES: { label: string; value: EventCategory }[] = [
  { label: 'Hackathons', value: 'hackathon' },
  { label: 'Competitions', value: 'competition' },
  { label: 'Workshops', value: 'workshop' },
  { label: 'Seminars', value: 'seminar' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Sports', value: 'sports' },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [query, setQuery] = useState('');
  const { data: eventsData } = useEvents({ limit: 50 });

  const events = eventsData?.data ?? [];

  // Filter events based on search query
  const filteredEvents = useMemo(() => {
    if (!query.trim()) return events.slice(0, 4);
    const q = query.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }, [events, query]);

  // Global keyboard listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const runAction = (callback: () => void) => {
    onOpenChange(false);
    callback();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-[#09090B]/80 backdrop-blur-md"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative z-10 w-full max-w-xl rounded-xl overflow-hidden bg-[#111114] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* Input Header */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
              <Search className="w-4 h-4 text-[#FF4D00] shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search events..."
                className="w-full bg-transparent text-sm text-[#F4F4F0] placeholder-[#8A8A93] focus:outline-none font-sans"
              />
              <span className="font-mono text-[10px] text-[#8A8A93] px-2 py-0.5 rounded bg-white/5 border border-white/10">
                ESC
              </span>
            </div>

            {/* Suggestions & Results List */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-4">
              {/* Event Matches */}
              {filteredEvents.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-mono tracking-widest text-[#8A8A93] uppercase">
                    EVENTS ({filteredEvents.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => runAction(() => router.push(`/events/${event.id}`))}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-white/5 group transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-2 h-2 rounded-full bg-[#FF4D00]" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-[#F4F4F0] group-hover:text-[#FF4D00] transition-colors truncate">
                              {event.title}
                            </p>
                            <p className="text-[10px] font-mono text-[#8A8A93] uppercase">
                              {event.category} // {event.eventType}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#8A8A93] group-hover:text-[#F4F4F0] transition-transform group-hover:translate-x-0.5 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Navigation Commands */}
              <div>
                <div className="px-3 py-1 text-[10px] font-mono tracking-widest text-[#8A8A93] uppercase">
                  DISPATCH COMMANDS
                </div>
                <div className="space-y-1 mt-1">
                  <button
                    onClick={() => runAction(() => router.push('/events'))}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#F4F4F0] hover:bg-white/5 group transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-[#8A8A93] group-hover:text-[#FF4D00]" />
                    <span>All Campus Events</span>
                  </button>

                  {isAuthenticated && (
                    <button
                      onClick={() => runAction(() => router.push('/events/create'))}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#F4F4F0] hover:bg-white/5 group transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#C8FF00]" />
                      <span>Host New Event</span>
                    </button>
                  )}

                  {isAuthenticated && (
                    <button
                      onClick={() => runAction(() => router.push('/notifications'))}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#F4F4F0] hover:bg-white/5 group transition-colors"
                    >
                      <Bell className="w-4 h-4 text-[#8A8A93] group-hover:text-[#FF4D00]" />
                      <span>Notification Feed</span>
                    </button>
                  )}

                  {isAuthenticated ? (
                    <button
                      onClick={() => runAction(() => router.push('/profile'))}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#F4F4F0] hover:bg-white/5 group transition-colors"
                    >
                      <User className="w-4 h-4 text-[#8A8A93] group-hover:text-[#FF4D00]" />
                      <span>Competitor Dossier ({user?.name})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => runAction(() => router.push('/login'))}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#F4F4F0] hover:bg-white/5 group transition-colors"
                    >
                      <Terminal className="w-4 h-4 text-[#FF4D00]" />
                      <span>Sign In with @seu.edu.bd</span>
                    </button>
                  )}

                  {isAuthenticated && (
                    <button
                      onClick={() => runAction(() => logout())}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#FF2E4C] hover:bg-[#FF2E4C]/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Category Quick Filters */}
              <div>
                <div className="px-3 py-1 text-[10px] font-mono tracking-widest text-[#8A8A93] uppercase">
                  FILTER BY TRACK
                </div>
                <div className="grid grid-cols-2 gap-1.5 mt-1 px-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => runAction(() => router.push(`/events?category=${cat.value}`))}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-white/5 border border-white/5 text-[11px] font-mono text-[#8A8A93] hover:text-[#F4F4F0] hover:border-white/20 transition-all text-left"
                    >
                      <Layers className="w-3 h-3 text-[#FF4D00]" />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Navigation Tip */}
            <div className="px-4 py-2.5 bg-[#0A0A0D] border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#8A8A93]">
              <span>NAVIGATE WITH ARROWS</span>
              <span>SEU DISPATCH // CMD+K</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
