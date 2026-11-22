import type { EventCategory, EventType } from '@/types';

// ─── Category config: Obsidian Editorial ───────────────────────────────────

export const CATEGORY_CONFIG: Record<
  EventCategory,
  { label: string; tag: string; badge: string; border: string; accent: string }
> = {
  hackathon: {
    label: 'Hackathon',
    tag: 'HACKATHON // BUILD',
    badge: 'bg-[#FF4D00]/10 text-[#FF4D00]',
    border: 'border-[#FF4D00]/30',
    accent: '#FF4D00',
  },
  competition: {
    label: 'Competition',
    tag: 'COMPETITION // ARENA',
    badge: 'bg-[#C8FF00]/10 text-[#C8FF00]',
    border: 'border-[#C8FF00]/30',
    accent: '#C8FF00',
  },
  workshop: {
    label: 'Workshop',
    tag: 'WORKSHOP // LAB',
    badge: 'bg-white/10 text-[#F4F4F0]',
    border: 'border-white/20',
    accent: '#F4F4F0',
  },
  seminar: {
    label: 'Seminar',
    tag: 'SEMINAR // DISPATCH',
    badge: 'bg-[#8A8A93]/15 text-[#8A8A93]',
    border: 'border-white/10',
    accent: '#8A8A93',
  },
  cultural: {
    label: 'Cultural',
    tag: 'CULTURAL // FEST',
    badge: 'bg-[#FF4D00]/15 text-[#FF4D00]',
    border: 'border-[#FF4D00]/30',
    accent: '#FF4D00',
  },
  sports: {
    label: 'Sports',
    tag: 'SPORTS // LEAGUE',
    badge: 'bg-[#C8FF00]/15 text-[#C8FF00]',
    border: 'border-[#C8FF00]/30',
    accent: '#C8FF00',
  },
  other: {
    label: 'Other',
    tag: 'CAMPUS // GENERAL',
    badge: 'bg-white/5 text-[#8A8A93]',
    border: 'border-white/10',
    accent: '#8A8A93',
  },
};

// ─── Event type config ─────────────────────────────────────────────────────

export const EVENT_TYPE_CONFIG: Record<
  EventType,
  { label: string; badge: string; border: string }
> = {
  online: {
    label: 'Online',
    badge: 'bg-white/5 text-[#8A8A93]',
    border: 'border-white/10',
  },
  offline: {
    label: 'On-Campus',
    badge: 'bg-[#FF4D00]/10 text-[#FF4D00]',
    border: 'border-[#FF4D00]/20',
  },
  hybrid: {
    label: 'Hybrid',
    badge: 'bg-[#C8FF00]/10 text-[#C8FF00]',
    border: 'border-[#C8FF00]/20',
  },
};

// ─── Select options ────────────────────────────────────────────────────────

export const CATEGORY_OPTIONS: { value: EventCategory; label: string }[] = [
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'competition', label: 'Competition' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

export const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'On-Campus' },
  { value: 'hybrid', label: 'Hybrid' },
];
