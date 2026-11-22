'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, ShieldCheck, Sparkles, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event, User } from '@/types';
import { formatDate } from '@/lib/format';

interface EventPassModalProps {
  open: boolean;
  onClose: () => void;
  event: Event;
  user: User | null;
  teamName?: string | null;
}

export function EventPassModal({
  open,
  onClose,
  event,
  user,
  teamName,
}: EventPassModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [sheenPosition, setSheenPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setSheenPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const passId = `SEU-PASS-${event.id.slice(-6).toUpperCase()}`;
  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/events/${event.id}`
    : `https://events.seu.edu.bd/events/${event.id}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#09090B]/85 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative z-10 w-full max-w-xl flex flex-col items-center"
          >
            {/* Top Close Pill */}
            <div className="w-full flex justify-between items-center mb-4 px-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A93] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
                OFFICIAL COMPETITOR PASS // 2026
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-white/10 bg-[#111114] flex items-center justify-center text-[#8A8A93] hover:text-[#F4F4F0] hover:border-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3D Tilting Ticket Pass */}
            <div
              style={{ perspective: 1200 }}
              className="w-full py-2 flex justify-center"
            >
              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{ rotateX, rotateY }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="relative w-full max-w-[540px] rounded-2xl overflow-hidden bg-[#111114] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Dynamic Sheen overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-25 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle 350px at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255,255,255,0.4), transparent 70%)`,
                  }}
                />

                {/* Ticket Header Bar */}
                <div className="px-6 py-4 bg-[#18181E] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D00] shadow-[0_0_10px_#FF4D00]" />
                    <span className="font-heading font-bold text-sm tracking-tight text-[#F4F4F0]">
                      SOUTHEAST UNIVERSITY
                    </span>
                  </div>
                  <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-[#FF4D00]/15 text-[#FF4D00] border border-[#FF4D00]/30 font-semibold">
                    {event.category} // {event.eventType}
                  </span>
                </div>

                {/* Ticket Body: 2 Columns with Perforation */}
                <div className="flex flex-col sm:flex-row">
                  {/* Left Column: Event & Attendee Info (65%) */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div>
                      <div className="text-[10px] font-mono tracking-widest text-[#8A8A93] uppercase mb-1">
                        EVENT DISPATCH
                      </div>
                      <h2 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-[#F4F4F0] line-clamp-2">
                        {event.title}
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                      <div>
                        <div className="text-[9px] text-[#8A8A93] uppercase">ATTENDEE</div>
                        <div className="font-semibold text-[#F4F4F0] truncate">
                          {user?.name || 'Guest Competitor'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#8A8A93] uppercase">DEPT</div>
                        <div className="font-semibold text-[#F4F4F0] truncate">
                          {user?.department || 'Southeast Univ'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#8A8A93] uppercase">EVENT DATE</div>
                        <div className="font-semibold text-[#C8FF00]">
                          {formatDate(event.eventDate)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#8A8A93] uppercase">SQUAD</div>
                        <div className="font-semibold text-[#FF4D00] truncate">
                          {teamName || 'FREE AGENT'}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-[#8A8A93]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF00]" />
                      <span>OFFICIALLY VERIFIED PASS // SEU DISPATCH</span>
                    </div>
                  </div>

                  {/* Perforated Vertical Divider */}
                  <div className="relative hidden sm:flex flex-col items-center justify-between w-0 border-l border-dashed border-white/20">
                    <div className="w-5 h-5 rounded-full bg-[#09090B] -translate-x-1/2 -translate-y-1/2 shadow-inner border border-white/10" />
                    <div className="w-5 h-5 rounded-full bg-[#09090B] -translate-x-1/2 translate-y-1/2 shadow-inner border border-white/10" />
                  </div>

                  {/* Right Column: QR Code & Stamped ID (35%) */}
                  <div className="p-6 bg-[#0E0E11] sm:w-44 flex flex-col items-center justify-center text-center space-y-3 border-t sm:border-t-0 sm:border-l border-white/10">
                    <div className="p-2.5 rounded-lg bg-white shadow-md">
                      <QRCodeSVG
                        value={verificationUrl}
                        size={100}
                        bgColor="#FFFFFF"
                        fgColor="#09090B"
                        level="M"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-mono text-[#8A8A93] tracking-widest uppercase">
                        ENTRY PASS ID
                      </div>
                      <div className="text-xs font-mono font-bold text-[#F4F4F0] tracking-wider">
                        {passId}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Barcode Strip Footer */}
                <div className="px-6 py-2.5 bg-[#0A0A0D] border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#8A8A93]">
                  <span>NOTCH // VALIDATED ENTRY</span>
                  <span className="tracking-widest">||||| | |||| || ||||| |||</span>
                  <span>SEU // 2026</span>
                </div>
              </motion.div>
            </div>

            {/* Actions Bar */}
            <div className="w-full max-w-[540px] mt-4 flex gap-3">
              <Button
                onClick={handlePrint}
                className="flex-1 h-10 font-mono text-xs uppercase tracking-wider bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-semibold gap-2 shadow-[0_4px_20px_rgba(255,77,0,0.3)]"
              >
                <Printer className="w-4 h-4" />
                Print / Save Pass
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="h-10 px-5 font-mono text-xs uppercase tracking-wider border-white/15 bg-[#111114] text-[#F4F4F0] hover:bg-white/5"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
