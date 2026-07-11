'use client';

import { cn } from '@/lib/utils';
import type { EventCategory } from '@/types';
import { CATEGORY_OPTIONS } from '../utils';

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
        'px-3 py-1 text-xs font-medium rounded-full border transition-colors',
        active
          ? 'bg-foreground text-background border-foreground'
          : 'bg-background text-muted-foreground border-border hover:border-foreground/50 hover:text-foreground',
      )}
    >
      {label}
    </button>
  );
}
