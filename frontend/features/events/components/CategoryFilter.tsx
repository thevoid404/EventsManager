'use client';

import { cn } from '@/lib/utils';
import type { EventCategory } from '@/types';
import { CATEGORY_OPTIONS } from '../utils';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  selected: EventCategory | undefined;
  onChange: (category: EventCategory | undefined) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <FilterPill
        label="ALL TRACKS"
        active={!selected}
        onClick={() => onChange(undefined)}
      />
      {CATEGORY_OPTIONS.map((opt) => (
        <FilterPill
          key={opt.value}
          label={opt.label.toUpperCase()}
          active={selected === opt.value}
          onClick={() =>
            onChange(selected === opt.value ? undefined : opt.value)
          }
        />
      ))}
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative px-3 py-1.5 text-[11px] font-mono tracking-wider font-semibold rounded-md border transition-all duration-200 select-none outline-none',
        active
          ? 'text-white border-[#FF4D00]'
          : 'bg-[#111114] text-[#8A8A93] border-white/8 hover:border-white/20 hover:text-[#F4F4F0]'
      )}
    >
      {active && (
        <motion.span
          layoutId="activeCategoryPill"
          className="absolute inset-0 bg-[#FF4D00] rounded-md -z-10 shadow-[0_0_12px_rgba(255,77,0,0.5)]"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
