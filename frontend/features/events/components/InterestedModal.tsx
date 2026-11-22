'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUICK_CHIPS = ['Frontend // React', 'Backend // Node', 'AI / ML', 'Design & UI', 'Cybersec', 'Competitive Prog'];

interface InterestedModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (interestText: string) => Promise<void>;
  isPending: boolean;
}

export function InterestedModal({
  open,
  onClose,
  onSubmit,
  isPending,
}: InterestedModalProps) {
  const [interest, setInterest] = useState('');

  const handleSubmit = async () => {
    const text = interest.trim();
    if (!text) return;
    await onSubmit(text);
    setInterest('');
  };

  const handleClose = () => {
    if (isPending) return;
    setInterest('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-[420px] bg-[#111114] border border-white/15 text-[#F4F4F0] shadow-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF4D00] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            FREE AGENT // SIGNAL INTENT
          </div>
          <DialogTitle className="text-xl font-heading font-bold text-[#F4F4F0]">
            Declare Event Interest
          </DialogTitle>
          <DialogDescription className="text-xs text-[#8A8A93] leading-relaxed">
            Announce your intent to attend and let captains or prospective squadmates discover your skills.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="interest-input" className="text-xs font-mono uppercase text-[#8A8A93]">
              Primary Focus / Tech Stack
            </Label>
            <input
              id="interest-input"
              placeholder="e.g. Fullstack React + FastAPI / UI Designer"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
              autoFocus
              className="w-full h-10 px-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/60 focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00] transition-colors"
            />
          </div>

          {/* Quick chips */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-[#8A8A93] uppercase tracking-wider">
              SUGGESTED ROLES
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setInterest(chip)}
                  className={cn(
                    'px-2.5 py-1 text-[10px] font-mono rounded border transition-colors',
                    interest === chip
                      ? 'bg-[#FF4D00] text-white border-[#FF4D00]'
                      : 'bg-[#18181E] border-white/10 text-[#8A8A93] hover:border-white/20 hover:text-[#F4F4F0]'
                  )}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-white/8">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="h-9 font-mono text-xs uppercase border-white/10 bg-[#18181E] text-[#F4F4F0] hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!interest.trim() || isPending}
            className="h-9 font-mono text-xs uppercase bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-bold"
          >
            {isPending && (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            )}
            Broadcast Signal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
