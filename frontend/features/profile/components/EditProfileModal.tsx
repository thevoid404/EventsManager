'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, User, Building, Image } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { User as UserType } from '@/types';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  department: z.string().min(2, 'Department is required'),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType;
  onSave: (data: ProfileFormValues) => void;
  isPending: boolean;
}

export function EditProfileModal({
  open,
  onOpenChange,
  user,
  onSave,
  isPending,
}: EditProfileModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      department: user.department || '',
      avatarUrl: user.avatarUrl || '',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    onSave(data);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      reset({
        name: user.name,
        department: user.department || '',
        avatarUrl: user.avatarUrl || '',
      });
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
            DOSSIER CONFIGURATION // 2026
          </div>
          <DialogTitle className="text-xl font-heading font-bold text-[#F4F4F0]">
            Update Competitor Record
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="edit-name" className="text-xs font-mono uppercase text-[#8A8A93]">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A93] pointer-events-none" />
              <input
                id="edit-name"
                {...register('name')}
                className="w-full h-10 pl-9 pr-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] focus:outline-none focus:border-[#FF4D00]"
              />
            </div>
            {errors.name && (
              <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.name.message}</p>
            )}
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label htmlFor="edit-dept" className="text-xs font-mono uppercase text-[#8A8A93]">
              Department
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A93] pointer-events-none" />
              <input
                id="edit-dept"
                {...register('department')}
                className="w-full h-10 pl-9 pr-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] focus:outline-none focus:border-[#FF4D00]"
              />
            </div>
            {errors.department && (
              <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.department.message}</p>
            )}
          </div>

          {/* Avatar URL */}
          <div className="space-y-1.5">
            <label htmlFor="edit-avatar" className="text-xs font-mono uppercase text-[#8A8A93]">
              Avatar Image URL (Optional)
            </label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A93] pointer-events-none" />
              <input
                id="edit-avatar"
                placeholder="https://..."
                {...register('avatarUrl')}
                className="w-full h-10 pl-9 pr-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>
            {errors.avatarUrl && (
              <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.avatarUrl.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/8">
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
              className="h-9 font-mono text-xs uppercase bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-bold"
            >
              {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
