'use client';

import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/error-state';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Loader2,
  Sparkles,
  UserPlus,
  UsersRound,
  XCircle,
  Radio,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { NotificationType } from '@/types';

const NOTIF_ICONS: Record<NotificationType, React.ReactNode> = {
  request_received: <UserPlus className="w-4 h-4 text-[#FF4D00]" />,
  request_accepted: <Check className="w-4 h-4 text-[#C8FF00]" />,
  request_rejected: <XCircle className="w-4 h-4 text-[#FF2E4C]" />,
  member_joined: <UsersRound className="w-4 h-4 text-[#C8FF00]" />,
};

export default function NotificationsPage() {
  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
    markReadMutation,
    markAllReadMutation,
  } = useNotifications();

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse pb-16">
        <div className="h-8 w-48 bg-white/10 rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-[#111114] rounded-xl border border-white/8" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-10">
        <ErrorState
          description="Could not synchronize notification telemetry."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const items = notifications ?? [];
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111114] border border-white/10 shadow-lg">
        <div className="space-y-1">
          <div className="text-[10px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[#FF4D00] animate-pulse" />
            TELEMETRY FEED // NOTIFICATIONS
          </div>
          <h1 className="text-2xl font-heading font-black tracking-tight text-[#F4F4F0] uppercase">
            COMMUNICATION LOG
          </h1>
          <p className="text-xs text-[#8A8A93]">
            Incoming squad join requests, recruitment decisions, and competitor announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            className="h-9 px-3.5 font-mono text-xs uppercase border-white/15 bg-[#18181E] text-[#F4F4F0] hover:border-[#C8FF00] hover:text-[#C8FF00] gap-1.5 shrink-0"
          >
            {markAllReadMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCheck className="w-3.5 h-3.5 text-[#C8FF00]" />
            )}
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {items.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#111114] border border-dashed border-white/10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-[#8A8A93]">
            <CheckCheck className="w-5 h-5 text-[#C8FF00]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-heading font-bold text-[#F4F4F0] uppercase">
              NO PENDING TRANSMISSIONS
            </h3>
            <p className="text-xs text-[#8A8A93] max-w-xs mx-auto">
              Your inbox is clear. New squad requests and status updates will broadcast here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((notification) => (
            <div
              key={notification.id}
              onClick={() => {
                if (!notification.read) markReadMutation.mutate(notification.id);
              }}
              className={cn(
                'p-4 rounded-xl border transition-all flex items-start gap-4 cursor-pointer shadow-md',
                notification.read
                  ? 'bg-[#111114] border-white/8 text-[#8A8A93]'
                  : 'bg-[#141418] border-[#FF4D00]/40 text-[#F4F4F0] shadow-[0_4px_20px_rgba(255,77,0,0.1)]'
              )}
            >
              <div className="p-2 rounded-lg bg-[#18181E] border border-white/10 shrink-0 mt-0.5">
                {NOTIF_ICONS[notification.type] || (
                  <Sparkles className="w-4 h-4 text-[#FF4D00]" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <p className={cn('text-xs sm:text-sm leading-relaxed', !notification.read && 'font-semibold text-[#F4F4F0]')}>
                  {notification.message}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A8A93]">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {!notification.read && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    markReadMutation.mutate(notification.id);
                  }}
                  className="p-1 rounded text-[#8A8A93] hover:text-[#C8FF00] transition-colors shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
