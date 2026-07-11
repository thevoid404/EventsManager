import type { EventCategory, EventType } from '@/types';

// ─── Category config ───────────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<
  EventCategory,
  { label: string; gradient: string; badge: string; border: string }
> = {
  hackathon: {
    label: 'Hackathon',
    gradient: 'from-blue-500 to-indigo-600',
    badge: 'bg-blue-50 text-blue-700',
    border: 'border-blue-200',
  },
  workshop: {
    label: 'Workshop',
    gradient: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-50 text-emerald-700',
    border: 'border-emerald-200',
  },
  seminar: {
    label: 'Seminar',
    gradient: 'from-violet-500 to-purple-600',
    badge: 'bg-violet-50 text-violet-700',
    border: 'border-violet-200',
  },
  competition: {
    label: 'Competition',
    gradient: 'from-orange-500 to-amber-600',
    badge: 'bg-orange-50 text-orange-700',
    border: 'border-orange-200',
  },
  cultural: {
    label: 'Cultural',
    gradient: 'from-pink-500 to-rose-600',
    badge: 'bg-pink-50 text-pink-700',
    border: 'border-pink-200',
  },
  sports: {
    label: 'Sports',
    gradient: 'from-red-500 to-orange-600',
    badge: 'bg-red-50 text-red-700',
    border: 'border-red-200',
  },
  other: {
    label: 'Other',
    gradient: 'from-zinc-400 to-zinc-500',
    badge: 'bg-zinc-100 text-zinc-700',
    border: 'border-zinc-200',
  },
};

// ─── Event type config ─────────────────────────────────────────────────────

export const EVENT_TYPE_CONFIG: Record<
  EventType,
  { label: string; badge: string; border: string }
> = {
  online: {
    label: 'Online',
    badge: 'bg-sky-50 text-sky-700',
    border: 'border-sky-200',
  },
  offline: {
    label: 'Offline',
    badge: 'bg-amber-50 text-amber-700',
    border: 'border-amber-200',
  },
  hybrid: {
    label: 'Hybrid',
    badge: 'bg-purple-50 text-purple-700',
    border: 'border-purple-200',
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
