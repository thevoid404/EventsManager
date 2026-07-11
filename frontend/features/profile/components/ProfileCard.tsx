'use client';

import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/types';

interface ProfileCardProps {
  user: User;
  onEdit?: () => void;
}

export function ProfileCard({ user, onEdit }: ProfileCardProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 rounded-xl border border-border bg-card shadow-sm">
      <Avatar className="h-24 w-24 shrink-0 border border-border">
        <AvatarImage src={user.avatarUrl || ''} alt={user.name} className="object-cover" />
        <AvatarFallback className="text-xl bg-muted text-muted-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 text-center sm:text-left space-y-1 mt-2 sm:mt-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold leading-none">{user.name}</h2>
            <p className="text-sm text-muted-foreground mt-1.5">{user.email}</p>
          </div>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
              <Edit className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          )}
        </div>
        
        {user.department && (
          <div className="pt-2">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              {user.department}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
