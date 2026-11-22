'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { EventCategory } from '@/types';

interface EventCoverArtProps {
  id: string;
  category: EventCategory;
  bannerUrl?: string | null;
  className?: string;
  variant?: 'card' | 'hero' | 'thumb';
}

// Pseudo-random number generator seeded with string
function pseudoRandom(seed: string) {
  let h = 0xdeadbeef;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h >>> 0) / 4294967296;
  };
}

export function EventCoverArt({
  id,
  category,
  bannerUrl,
  className = '',
  variant = 'card',
}: EventCoverArtProps) {
  // If a real image exists, render with obsidian vignette
  if (bannerUrl) {
    return (
      <div className={`relative overflow-hidden bg-[#09090B] ${className}`}>
        <Image
          src={bannerUrl}
          alt="Event cover"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Dark editorial vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-[#111114]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
      </div>
    );
  }

  // Generate deterministic procedural SVG
  const rand = useMemo(() => pseudoRandom(id + category), [id, category]);

  // Color palette constants
  const vermilion = '#FF4D00';
  const lime = '#C8FF00';
  const ash = '#8A8A93';
  const obsidian = '#0B0B0E';
  const elevated = '#141418';

  const categoryArtwork = useMemo(() => {
    switch (category) {
      case 'hackathon': {
        // Isometric wireframe grid with neon pulses & nodes
        const lines = [];
        for (let i = 0; i < 10; i++) {
          const y = 20 + i * 18;
          lines.push(
            <line
              key={`h-${i}`}
              x1="0"
              y1={y}
              x2="400"
              y2={y + 80}
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth="1"
            />
          );
          lines.push(
            <line
              key={`v-${i}`}
              x1={i * 45}
              y1="0"
              x2={i * 45 + 100}
              y2="240"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
          );
        }
        return (
          <g>
            <rect width="400" height="240" fill={obsidian} />
            {lines}
            {/* Coordinate glyphs */}
            <circle cx="160" cy="90" r="5" fill={vermilion} />
            <circle cx="160" cy="90" r="14" stroke={vermilion} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="280" cy="150" r="4" fill={lime} />
            <path
              d="M 60 180 L 160 90 L 280 150 L 360 80"
              fill="none"
              stroke={vermilion}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.8"
            />
            <text x="24" y="36" fill={ash} fontSize="10" fontFamily="monospace" letterSpacing="0.2em">
              SYS // NEURAL_GRID.01
            </text>
          </g>
        );
      }

      case 'competition': {
        // Concentric radar rings, target crosshairs, telemetry coordinates
        return (
          <g>
            <rect width="400" height="240" fill={obsidian} />
            {/* Radar concentric circles */}
            <circle cx="200" cy="120" r="30" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" fill="none" />
            <circle cx="200" cy="120" r="65" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" fill="none" />
            <circle cx="200" cy="120" r="105" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" fill="none" />
            {/* Crosshairs */}
            <line x1="200" y1="10" x2="200" y2="230" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="60" y1="120" x2="340" y2="120" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="1" strokeDasharray="2 4" />
            {/* Target reticle */}
            <circle cx="200" cy="120" r="8" fill="none" stroke={vermilion} strokeWidth="2" />
            <circle cx="200" cy="120" r="2" fill={vermilion} />
            {/* Target bracket */}
            <path d="M 175 95 L 165 95 L 165 105" fill="none" stroke={vermilion} strokeWidth="1.5" />
            <path d="M 225 95 L 235 95 L 235 105" fill="none" stroke={vermilion} strokeWidth="1.5" />
            <path d="M 175 145 L 165 145 L 165 135" fill="none" stroke={vermilion} strokeWidth="1.5" />
            <path d="M 225 145 L 235 145 L 235 135" fill="none" stroke={vermilion} strokeWidth="1.5" />
            <text x="24" y="36" fill={ash} fontSize="10" fontFamily="monospace" letterSpacing="0.2em">
              TARGET // 23.7808°N 90.4225°E
            </text>
          </g>
        );
      }

      case 'workshop':
      case 'seminar': {
        // Architectural contour wave lines and vector nodes
        return (
          <g>
            <rect width="400" height="240" fill={obsidian} />
            <path
              d="M 0 160 Q 100 80 200 140 T 400 100 L 400 240 L 0 240 Z"
              fill="rgba(255, 77, 0, 0.04)"
            />
            <path
              d="M 0 160 Q 100 80 200 140 T 400 100"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.5"
            />
            <path
              d="M 0 180 Q 120 110 220 170 T 400 130"
              fill="none"
              stroke="rgba(255, 77, 0, 0.4)"
              strokeWidth="1.5"
            />
            <path
              d="M 0 200 Q 140 140 240 200 T 400 160"
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="1"
            />
            {/* Step markers */}
            <circle cx="100" cy="115" r="3" fill={lime} />
            <circle cx="220" cy="170" r="3" fill={vermilion} />
            <circle cx="340" cy="140" r="3" fill="#F4F4F0" />
            <text x="24" y="36" fill={ash} fontSize="10" fontFamily="monospace" letterSpacing="0.2em">
              MODULAR // PROTOCOL_ACADEMY
            </text>
          </g>
        );
      }

      default: {
        // Geometric matrix with diagonal technical hatchings
        return (
          <g>
            <rect width="400" height="240" fill={obsidian} />
            <line x1="0" y1="0" x2="400" y2="240" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            <line x1="0" y1="240" x2="400" y2="0" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            <rect x="140" y="60" width="120" height="120" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
            <rect x="160" y="80" width="80" height="80" fill="none" stroke={vermilion} strokeWidth="1" opacity="0.6" />
            <circle cx="200" cy="120" r="20" fill="rgba(255, 77, 0, 0.15)" stroke={vermilion} strokeWidth="1" />
            <text x="24" y="36" fill={ash} fontSize="10" fontFamily="monospace" letterSpacing="0.2em">
              CAMPUS // DISPATCH_SEU
            </text>
          </g>
        );
      }
    }
  }, [category, obsidian, vermilion, lime, ash]);

  return (
    <div className={`relative overflow-hidden bg-[#09090B] flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      >
        <defs>
          <radialGradient id={`glow-${id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF4D00" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#09090B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="240" fill={`url(#glow-${id})`} />
        {categoryArtwork}
      </svg>
      {/* Subtle scanline texture */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
    </div>
  );
}
