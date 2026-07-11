import type { InterestedEntry } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface InterestedUserCardProps {
  entry: InterestedEntry;
}

export function InterestedUserCard({ entry }: InterestedUserCardProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
        <AvatarFallback className="text-xs font-medium bg-muted text-muted-foreground">
          {entry.user.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none truncate">
          {entry.user.name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {entry.user.department}
        </p>
        <p className="text-sm mt-1.5">{entry.interestText}</p>
      </div>
    </div>
  );
}
