'use client';

import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/section-header';
import { ErrorState } from '@/components/error-state';
import { Bell, Check, Loader2, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function NotificationsPage() {
  const { data: notifications, isLoading, isError, refetch, markReadMutation, markAllReadMutation } = useNotifications();

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 mt-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-10">
        <ErrorState
          description="Could not load notifications."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const hasUnread = notifications?.some((n) => !n.read);

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-4">
      <div className="flex items-center justify-between">
        <SectionHeader title="Notifications" className="mb-0 border-none pb-0" />
        {hasUnread && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            className="gap-2 text-xs"
          >
            {markAllReadMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Mark all as read
          </Button>
        )}
      </div>

      {!notifications || notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border rounded-xl border-dashed">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">No notifications</h3>
            <p className="text-muted-foreground text-sm mt-1">
              You're all caught up!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-4 rounded-xl flex gap-4 transition-colors border",
                notification.read
                  ? "bg-card border-border/50 text-muted-foreground"
                  : "bg-accent/50 border-primary/20 text-foreground"
              )}
            >
              <div className="shrink-0 mt-0.5">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  notification.read ? "bg-muted text-muted-foreground" : "bg-primary/20 text-primary"
                )}>
                  {notification.type === 'request_received' || notification.type === 'member_joined' ? (
                    <Info className="h-4 w-4" />
                  ) : notification.type === 'request_accepted' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm leading-relaxed", !notification.read && "font-medium")}>
                  {notification.message}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-muted-foreground/80">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8 rounded-full"
                  onClick={() => markReadMutation.mutate(notification.id)}
                  disabled={markReadMutation.isPending}
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
