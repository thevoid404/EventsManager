'use client';

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface LiveCountdownProps {
  deadline: string;
  variant?: 'compact' | 'badge' | 'detailed';
  className?: string;
}

export function LiveCountdown({
  deadline,
  variant = 'compact',
  className = '',
}: LiveCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    function calculate() {
      const target = new Date(deadline).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (timeLeft.isPast) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 text-[#FF2E4C] text-[10px] font-mono tracking-wider uppercase font-semibold ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E4C]" />
        REGISTRATION CLOSED
      </div>
    );
  }

  const isUrgent = timeLeft.days === 0;

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#111114] border ${
          isUrgent ? 'border-[#FF4D00]/40 text-[#FF4D00]' : 'border-white/10 text-[#C8FF00]'
        } text-xs font-mono font-bold tracking-wider ${className}`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isUrgent ? 'bg-[#FF4D00] animate-pulse' : 'bg-[#C8FF00]'
          }`}
        />
        <span>
          CLOSES IN {String(timeLeft.days).padStart(2, '0')}D :{' '}
          {String(timeLeft.hours).padStart(2, '0')}H :{' '}
          {String(timeLeft.minutes).padStart(2, '0')}M :{' '}
          {String(timeLeft.seconds).padStart(2, '0')}S
        </span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`grid grid-cols-4 gap-2 text-center font-mono ${className}`}>
        {[
          { label: 'DAYS', val: timeLeft.days },
          { label: 'HOURS', val: timeLeft.hours },
          { label: 'MINS', val: timeLeft.minutes },
          { label: 'SECS', val: timeLeft.seconds },
        ].map((unit) => (
          <div
            key={unit.label}
            className="p-2.5 rounded bg-[#18181E] border border-white/8 flex flex-col items-center justify-center"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F4F0]">
              {String(unit.val).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-[#8A8A93] tracking-widest uppercase mt-0.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Compact default
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-mono ${
        isUrgent ? 'text-[#FF4D00] font-medium' : 'text-[#8A8A93]'
      } ${className}`}
    >
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <span>
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m
        {timeLeft.days === 0 && ` : ${String(timeLeft.seconds).padStart(2, '0')}s`} left
      </span>
    </div>
  );
}
