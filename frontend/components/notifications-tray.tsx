'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  UserPlus,
  UsersRound,
  XCircle,
} from 'lucide-react';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { Notification, NotificationType } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsTrayProps {
  open: boolean;
  onClose: () => void;
}

const NOTIFICATION_ICONS: Record<NotificationType, React.ReactNode> = {
  request_received: <UserPlus className="w-3.5 h-3.5 text-[#FF4D00]" />,
  request_accepted: <Check className="w-3.5 h-3.5 text-[#C8FF00]" />,
  request_rejected: <XCircle className="w-3.5 h-3.5 text-[#FF2E4C]" />,
  member_joined: <UsersRound className="w-3.5 h-3.5 text-[#C8FF00]" />,
};

export function NotificationsTray({ open, onClose }: NotificationsTrayProps) {
  const { data: notifications, unreadCount, markReadMutation, markAllReadMutation } =
    useNotifications();

  const items = notifications ?? [];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Floating Dropdown Drawer */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-16 right-4 sm:right-8 z-50 w-full max-w-sm rounded-xl overflow-hidden bg-[#111114]/95 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-[#141418]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#FF4D00]" />
                <span className="font-heading font-bold text-sm tracking-tight text-[#F4F4F0]">
                  TACTICAL FEED
                </span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded bg-[#FF4D00] text-white text-[10px] font-mono font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  className="flex items-center gap-1 text-[11px] font-mono text-[#8A8A93] hover:text-[#C8FF00] transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-white/5">
              {items.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-white/5 mx-auto flex items-center justify-center text-[#8A8A93]">
                    <CheckCheck className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-mono text-[#8A8A93] uppercase tracking-wider">
                    ALL SIGNALS CLEAR // NO NOTIFICATIONS
                  </p>
                </div>
              ) : (
                items.slice(0, 15).map((notif: Notification) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.read) markReadMutation.mutate(notif.id);
                    }}
                    className={`p-3.5 hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-3 ${
                      !notif.read ? 'bg-[#FF4D00]/5' : ''
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-[#18181E] border border-white/10 shrink-0 mt-0.5">
                      {NOTIFICATION_ICONS[notif.type] || (
                        <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs text-[#F4F4F0] leading-snug break-words">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A8A93]">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(notif.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>

                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#FF4D00] shrink-0 mt-1.5" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-[#0A0A0D] border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#8A8A93]">
              <Link
                href="/notifications"
                onClick={onClose}
                className="hover:text-[#FF4D00] transition-colors"
              >
                VIEW FULL FEED →
              </Link>
              <span>SEU TELEMETRY</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
