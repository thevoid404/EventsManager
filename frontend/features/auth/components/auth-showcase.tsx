'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Sparkles, Terminal, Radio } from 'lucide-react';

const MARQUEE_ITEMS = [
  'AI & API HACKATHON // REGISTRATION OPEN',
  'MONTHLY CP CONTEST 007 // FRIDAY 17 JULY',
  'SQUAD FORMATION PROTOCOL // ACTIVE',
  'SOUTHEAST UNIVERSITY // CSE & EEE ARENA',
  'FREE AGENT PIPELINE // AVAILABLE NOW',
];

export function AuthShowcase() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 p-12 bg-[#0C0C0F] border-r border-white/10 overflow-hidden select-none">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[#FF4D00]/10 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF4D00] flex items-center justify-center text-white font-mono font-bold text-sm shadow-[0_0_15px_rgba(255,77,0,0.5)]">
            SEU
          </div>
          <div>
            <div className="font-heading font-black text-sm text-[#F4F4F0] tracking-tight">
              SOUTHEAST UNIVERSITY
            </div>
            <div className="font-mono text-[9px] text-[#8A8A93] tracking-widest uppercase">
              CAMPUS DISPATCH // AUTH GATEWAY
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#111114] border border-white/10 text-[10px] font-mono text-[#C8FF00]">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>GATEWAY 2026 // ONLINE</span>
        </div>
      </div>

      {/* Center 3D Floating Ticket Showcase */}
      <div className="relative z-10 my-auto py-8 flex flex-col items-center">
        <motion.div
          animate={{
            y: [-6, 6, -6],
            rotateZ: [-1, 1, -1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full max-w-sm rounded-xl overflow-hidden bg-[#111114] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
        >
          {/* Ticket Header */}
          <div className="px-5 py-3 bg-[#18181E] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF4D00]" />
              <span className="font-heading font-bold text-xs text-[#F4F4F0] tracking-tight">
                SAMPLE COMPETITOR PASS
              </span>
            </div>
            <span className="font-mono text-[9px] text-[#FF4D00] uppercase font-bold px-1.5 py-0.5 rounded bg-[#FF4D00]/10 border border-[#FF4D00]/20">
              HACKATHON // 2026
            </span>
          </div>

          {/* Ticket Details */}
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="space-y-3">
              <div>
                <div className="text-[9px] font-mono text-[#8A8A93] uppercase">COMPETITOR</div>
                <div className="font-heading font-bold text-sm text-[#F4F4F0]">
                  Ashraf Uddin Anas
                </div>
                <div className="text-[10px] font-mono text-[#C8FF00]">
                  2024000000309@seu.edu.bd
                </div>
              </div>

              <div>
                <div className="text-[9px] font-mono text-[#8A8A93] uppercase">DEPARTMENT</div>
                <div className="text-xs font-mono text-[#8A8A93]">
                  Computer Science & Eng
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8A8A93]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF00]" />
                <span>OFFICIAL CAMPUS ID VERIFIED</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="p-2 rounded bg-white shrink-0">
              <QRCodeSVG
                value="https://events.seu.edu.bd"
                size={75}
                bgColor="#FFFFFF"
                fgColor="#09090B"
                level="M"
              />
            </div>
          </div>

          <div className="px-5 py-2 bg-[#09090B] border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-[#8A8A93]">
            <span>SEU-PASS-VERIFIED</span>
            <span className="tracking-widest">|||| ||| |||||</span>
          </div>
        </motion.div>

        {/* Editorial Quote */}
        <div className="mt-8 text-center max-w-xs space-y-1">
          <p className="font-heading font-black text-lg uppercase tracking-tight text-[#F4F4F0]">
            ASSEMBLE YOUR SQUAD.
          </p>
          <p className="text-xs font-sans text-[#8A8A93] leading-relaxed">
            Direct coordination for Southeast University competitions, hackathons, and workshop registration.
          </p>
        </div>
      </div>

      {/* Bottom Kinetic Marquee */}
      <div className="relative z-10 overflow-hidden py-2 border-t border-white/10">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex items-center gap-6 whitespace-nowrap font-mono text-[10px] text-[#8A8A93] tracking-widest uppercase"
        >
          {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <span>{item}</span>
              <span className="text-[#FF4D00]">★</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
