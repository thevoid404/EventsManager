import { axiosInstance } from '@/lib/axios';
import type { Notification } from '@/types';

export const notificationsService = {
  /**
   * Get all notifications for the current user.
   */
  getAll: async (): Promise<Notification[]> => {
    const res = await axiosInstance.get<Notification[]>('/notifications');
    return res.data;
  },

  /**
   * Mark a single notification as read.
   */
  markRead: async (notificationId: string): Promise<Notification> => {
    const res = await axiosInstance.patch<Notification>(
      `/notifications/${notificationId}/read`,
    );
    return res.data;
  },

  /**
   * Mark all notifications as read.
   */
  markAllRead: async (): Promise<void> => {
    await axiosInstance.patch('/notifications/read-all');
  },

  /**
   * Get unread notification count (for the navbar badge).
   */
  getUnreadCount: async (): Promise<number> => {
    const res = await axiosInstance.get<{ count: number }>(
      '/notifications/unread-count',
    );
    return res.data.count;
  },
};
