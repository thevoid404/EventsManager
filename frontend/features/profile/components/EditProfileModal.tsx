'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { User } from '@/types';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  department: z.string().min(2, 'Department is required'),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
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

  // Reset form when modal closes/opens to keep it synced with user data
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register('name')} aria-invalid={!!errors.name} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              {...register('department')}
              aria-invalid={!!errors.department}
            />
            {errors.department && (
              <p className="text-xs text-destructive">
                {errors.department.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
            <Input
              id="avatarUrl"
              placeholder="https://example.com/avatar.jpg"
              {...register('avatarUrl')}
              aria-invalid={!!errors.avatarUrl}
            />
            {errors.avatarUrl && (
              <p className="text-xs text-destructive">
                {errors.avatarUrl.message}
              </p>
            )}
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
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
