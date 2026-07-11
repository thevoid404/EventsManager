'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join {teamName}</DialogTitle>
          <DialogDescription>
            Introduce yourself to the team leader. Let them know what skills you bring.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="introduction">Introduction message (optional)</Label>
            <Textarea
              id="introduction"
              placeholder="Hi, I am interested in joining..."
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
