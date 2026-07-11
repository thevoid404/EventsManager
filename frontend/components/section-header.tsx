import { cn } from '@/lib/utils';

export function SectionHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        'text-lg font-semibold tracking-tight border-b border-border pb-2',
        className
      )}
    >
      {title}
    </h2>
  );
}
