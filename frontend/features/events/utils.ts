import type { EventCategory, EventType } from '@/types';

// ─── Category config ───────────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<
  EventCategory,
  { label: string; gradient: string; badge: string; border: string }
> = {
  hackathon: {
    label: 'Hackathon',
    gradient: 'from-blue-500 to-indigo-600',
    badge: 'bg-blue-500/10 text-blue-400',
    border: 'border-blue-500/20',
  },
  workshop: {
    label: 'Workshop',
    gradient: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-500/10 text-emerald-400',
    border: 'border-emerald-500/20',
  },
  seminar: {
    label: 'Seminar',
    gradient: 'from-violet-500 to-purple-600',
    badge: 'bg-violet-500/10 text-violet-400',
    border: 'border-violet-500/20',
  },
  competition: {
    label: 'Competition',
    gradient: 'from-orange-500 to-amber-600',
    badge: 'bg-orange-500/10 text-orange-400',
    border: 'border-orange-500/20',
  },
  cultural: {
    label: 'Cultural',
    gradient: 'from-pink-500 to-rose-600',
    badge: 'bg-pink-500/10 text-pink-400',
    border: 'border-pink-500/20',
  },
  sports: {
    label: 'Sports',
    gradient: 'from-red-500 to-orange-600',
    badge: 'bg-red-500/10 text-red-400',
    border: 'border-red-500/20',
  },
  other: {
    label: 'Other',
    gradient: 'from-zinc-400 to-zinc-500',
    badge: 'bg-zinc-500/10 text-zinc-400',
    border: 'border-zinc-500/20',
  },
};

// ─── Event type config ─────────────────────────────────────────────────────

export const EVENT_TYPE_CONFIG: Record<
  EventType,
  { label: string; badge: string; border: string }
> = {
  online: {
    label: 'Online',
    badge: 'bg-sky-500/10 text-sky-400',
    border: 'border-sky-500/20',
  },
  offline: {
    label: 'Offline',
    badge: 'bg-amber-500/10 text-amber-400',
    border: 'border-amber-500/20',
  },
  hybrid: {
    label: 'Hybrid',
    badge: 'bg-purple-500/10 text-purple-400',
    border: 'border-purple-500/20',
  },
};

// ─── Select options ────────────────────────────────────────────────────────

export const CATEGORY_OPTIONS: { value: EventCategory; label: string }[] = [
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'competition', label: 'Competition' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

export const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'hybrid', label: 'Hybrid' },
];
