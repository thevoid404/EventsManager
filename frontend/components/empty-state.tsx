import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center px-4 rounded-2xl bg-[#111114] border border-dashed border-white/10',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-[#18181E] border border-white/10 p-3.5 text-[#8A8A93]">
          <Icon className="h-6 w-6 text-[#FF4D00]" />
        </div>
      )}
      <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-[#F4F4F0]">{title}</h3>
      {description && (
        <p className="mt-1.5 text-xs text-[#8A8A93] max-w-xs leading-relaxed font-sans">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
