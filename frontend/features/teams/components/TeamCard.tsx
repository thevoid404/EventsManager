'use client';

import React, { useState } from 'react';
import { Users, Info, Shield, ArrowUpRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Team } from '@/types';
import { SquadDrawer } from './squad-drawer';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentCount = team.members?.length ?? team.currentMembers ?? 1;
  const maxCount = team.maxMembers ?? 4;
  const isFull = currentCount >= maxCount;
  const openSlots = Math.max(0, maxCount - currentCount);

  return (
    <>
      <div
        onClick={() => setDrawerOpen(true)}
        className="group relative rounded-xl overflow-hidden bg-[#111114] border border-white/8 hover:border-[#FF4D00]/40 transition-all duration-300 p-5 flex flex-col justify-between space-y-4 cursor-pointer shadow-md hover:shadow-xl"
      >
        {/* Top Header: Name and Status */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="w-8 h-8 rounded border border-white/10 shrink-0">
                <AvatarFallback className="bg-white/10 text-xs font-mono font-bold text-[#F4F4F0] rounded">
                  {team.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="text-base font-heading font-bold text-[#F4F4F0] group-hover:text-[#FF4D00] transition-colors truncate">
                  {team.name}
                </h3>
                <p className="text-[10px] font-mono text-[#8A8A93] truncate">
                  CAPT // {team.leaderName || 'Squad Leader'}
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                isFull
                  ? 'bg-[#FF2E4C]/10 text-[#FF2E4C] border-[#FF2E4C]/25'
                  : 'bg-[#C8FF00]/10 text-[#C8FF00] border-[#C8FF00]/30'
              }`}
            >
              {isFull ? 'FULL' : `${openSlots} SLOTS`}
            </span>
          </div>

          {/* Looking For Specialty */}
          {team.lookingFor && (
            <div className="flex items-center gap-1.5 p-2 rounded bg-[#18181E] border border-white/5 text-[11px] font-mono text-[#F4F4F0] truncate">
              <Info className="w-3 h-3 text-[#FF4D00] shrink-0" />
              <span className="truncate">WANT: {team.lookingFor}</span>
            </div>
          )}

          {/* Brief Description */}
          {team.description && (
            <p className="text-xs text-[#8A8A93] line-clamp-2 leading-relaxed">
              {team.description}
            </p>
          )}
        </div>

        {/* Slot Pips Indicator Bar */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8A8A93]">
            <span>SLOT ROSTER</span>
            <span className="font-semibold text-[#F4F4F0]">
              {currentCount} / {maxCount}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: maxCount }).map((_, i) => {
              const filled = i < currentCount;
              return (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-sm border ${
                    filled
                      ? 'bg-[#C8FF00] border-[#C8FF00] shadow-[0_0_6px_rgba(200,255,0,0.4)]'
                      : 'bg-white/5 border-white/10'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Footer Trigger */}
        <div className="flex items-center justify-between text-xs font-mono text-[#8A8A93] group-hover:text-[#F4F4F0] transition-colors pt-1">
          <span>INSPECT SQUAD / ROSTER</span>
          <ArrowUpRight className="w-4 h-4 text-[#FF4D00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>

      <SquadDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        team={team}
      />
    </>
  );
}
