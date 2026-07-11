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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUICK_CHIPS = ['AI', 'Backend', 'Frontend', 'Robotics', 'Design', 'Anything'];

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
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>What are you interested in?</DialogTitle>
          <DialogDescription>
            Let others know what skills or areas you&apos;re bringing to this
            event.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="interest-input" className="text-sm">
              Your interest
            </Label>
            <Input
              id="interest-input"
              placeholder="e.g. AI, Backend, Design..."
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
              autoFocus
            />
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setInterest(chip)}
                className={cn(
                  'px-2.5 py-1 text-xs rounded-full border transition-colors',
                  interest === chip
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground',
                )}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!interest.trim() || isPending}
          >
            {isPending && (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            )}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
