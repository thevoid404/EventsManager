'use client';

import { useState } from 'react';
import { Loader2, Send, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface JoinRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  onSave: (introduction: string) => void;
  isPending: boolean;
}

export function JoinRequestModal({
  open,
  onOpenChange,
  teamName,
  onSave,
  isPending,
}: JoinRequestModalProps) {
  const [introduction, setIntroduction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(introduction);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setIntroduction('');
    }
    if (!isPending) {
      onOpenChange(isOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-[#111114] border border-white/15 text-[#F4F4F0] shadow-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF4D00] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            SQUAD RECRUITMENT SIGNAL
          </div>
          <DialogTitle className="text-xl font-heading font-bold text-[#F4F4F0]">
            Apply to {teamName}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#8A8A93] leading-relaxed">
            Transmit an introductory briefing to the squad captain detailing your skills and focus.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label htmlFor="introduction" className="text-xs font-mono uppercase text-[#8A8A93]">
              Introductory Message (Optional)
            </label>
            <textarea
              id="introduction"
              placeholder="e.g. 3rd year CSE student specializing in backend APIs & cloud..."
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              rows={4}
              className="w-full p-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/8">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="h-9 font-mono text-xs uppercase border-white/10 bg-[#18181E] text-[#8A8A93] hover:text-[#F4F4F0]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-9 font-mono text-xs uppercase bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-bold gap-1.5"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Transmit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
