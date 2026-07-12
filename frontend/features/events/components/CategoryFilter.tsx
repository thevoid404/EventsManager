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
        label="All"
        active={!selected}
        onClick={() => onChange(undefined)}
      />
      {CATEGORY_OPTIONS.map((opt) => (
        <FilterPill
          key={opt.value}
          label={opt.label}
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
        'relative px-3.5 py-1.5 text-xs font-medium rounded-full border transition-colors duration-250 select-none outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'text-background border-foreground'
          : 'bg-background text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground',
      )}
    >
      {active && (
        <motion.span
          layoutId="activeCategory"
          className="absolute inset-0 bg-foreground rounded-full -z-10"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
