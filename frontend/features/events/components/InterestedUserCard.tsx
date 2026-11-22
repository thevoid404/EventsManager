import type { InterestedEntry } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles, Terminal } from 'lucide-react';

interface InterestedUserCardProps {
  entry: InterestedEntry;
}

export function InterestedUserCard({ entry }: InterestedUserCardProps) {
  return (
    <div className="p-4 rounded-xl bg-[#141418] border border-white/8 flex items-start justify-between gap-4 hover:border-white/20 transition-colors">
      <div className="flex items-start gap-3 min-w-0">
        <Avatar className="h-9 w-9 rounded border border-white/10 shrink-0">
          <AvatarFallback className="text-xs font-mono font-bold bg-[#18181E] text-[#F4F4F0] rounded">
            {entry.user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1.5 min-w-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-bold text-[#F4F4F0] truncate">
                {entry.user.name}
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30 font-semibold shrink-0">
                AVAILABLE FREE AGENT
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#8A8A93] truncate">
              {entry.user.department}
            </p>
          </div>

          {/* Declared Interest Note */}
          {entry.interestText && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#F4F4F0] bg-[#09090B] px-2.5 py-1.5 rounded border border-white/5">
              <Terminal className="w-3 h-3 text-[#FF4D00] shrink-0" />
              <span className="truncate">{entry.interestText}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
