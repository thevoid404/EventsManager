import React from 'react';

export function EventCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#111114] border border-white/8 flex flex-col animate-pulse">
      <div className="h-40 w-full bg-[#18181E]" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-4 w-24 bg-white/5 rounded" />
          <div className="h-4 w-16 bg-white/5 rounded" />
        </div>
        <div className="h-5 w-4/5 bg-white/10 rounded" />
        <div className="space-y-2 py-1">
          <div className="h-3 w-1/2 bg-white/5 rounded" />
          <div className="h-3 w-2/3 bg-white/5 rounded" />
        </div>
        <div className="h-3 w-1/3 bg-white/5 rounded" />
        <div className="flex gap-2 pt-2 border-t border-white/5">
          <div className="h-8 flex-1 bg-white/5 rounded" />
          <div className="h-8 flex-1 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}
