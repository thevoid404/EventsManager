'use client';

import { Edit, ShieldCheck, Terminal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/types';

interface ProfileCardProps {
  user: User;
  onEdit?: () => void;
  stats?: {
    createdEventsCount: number;
    interestedEventsCount: number;
    squadsCount: number;
  };
}

export function ProfileCard({ user, onEdit, stats }: ProfileCardProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const studentId = user.email.split('@')[0];

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#111114] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden">
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FF4D00]/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Avatar + Identity */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <Avatar className="h-20 w-20 rounded-xl border border-white/15 shadow-xl shrink-0">
            <AvatarImage src={user.avatarUrl || ''} alt={user.name} className="object-cover" />
            <AvatarFallback className="text-xl font-heading font-black bg-[#18181E] text-[#FF4D00] rounded-xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-[10px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold">
                COMPETITOR DOSSIER //
              </span>
              <span className="text-[10px] font-mono text-[#C8FF00] flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                VERIFIED STUDENT
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[#F4F4F0] uppercase">
              {user.name}
            </h1>

            <div className="flex items-center gap-3 text-xs font-mono text-[#8A8A93] flex-wrap justify-center sm:justify-start">
              <span className="text-[#F4F4F0] bg-white/5 px-2 py-0.5 rounded border border-white/8">
                ID: {studentId}
              </span>
              <span>·</span>
              <span>{user.email}</span>
              {user.department && (
                <>
                  <span>·</span>
                  <span className="text-[#C8FF00]">{user.department}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Tactical Stats & Edit */}
        <div className="flex flex-col sm:flex-row items-center gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 shrink-0">
          {stats && (
            <div className="flex items-center gap-5 text-center font-mono">
              <div>
                <div className="text-[9px] text-[#8A8A93] uppercase">DISPATCHES</div>
                <div className="text-xl font-bold text-[#FF4D00]">
                  {String(stats.createdEventsCount).padStart(2, '0')}
                </div>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div>
                <div className="text-[9px] text-[#8A8A93] uppercase">INTERESTED</div>
                <div className="text-xl font-bold text-[#C8FF00]">
                  {String(stats.interestedEventsCount).padStart(2, '0')}
                </div>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div>
                <div className="text-[9px] text-[#8A8A93] uppercase">SQUADS</div>
                <div className="text-xl font-bold text-[#F4F4F0]">
                  {String(stats.squadsCount).padStart(2, '0')}
                </div>
              </div>
            </div>
          )}

          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="h-9 px-4 font-mono text-xs uppercase border-white/15 bg-[#18181E] text-[#F4F4F0] hover:border-white/30 gap-1.5"
            >
              <Edit className="w-3.5 h-3.5 text-[#FF4D00]" />
              Edit Dossier
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
