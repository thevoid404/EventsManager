import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'TELEMETRY CONNECTION INTERRUPTED',
  description = 'An unexpected transmission error occurred while querying campus records.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4 rounded-2xl bg-[#111114] border border-[#FF2E4C]/30 shadow-lg">
      <div className="mb-4 rounded-full bg-[#FF2E4C]/10 border border-[#FF2E4C]/25 p-3.5">
        <AlertTriangle className="h-6 w-6 text-[#FF2E4C]" />
      </div>
      <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#FF2E4C]">
        {title}
      </h3>
      <p className="mt-1.5 text-xs text-[#8A8A93] max-w-sm leading-relaxed font-sans">
        {description}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-5 h-8 font-mono text-xs uppercase border-white/15 bg-[#18181E] text-[#F4F4F0] hover:border-[#FF4D00] gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-establish Link
        </Button>
      )}
    </div>
  );
}
