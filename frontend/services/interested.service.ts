import { axiosInstance } from '@/lib/axios';
import type { InterestedEntry, MarkInterestedInput } from '@/types';

export const interestedService = {
  /**
   * Mark the current user as interested in an event.
   */
  markInterested: async (
    eventId: string,
    data: MarkInterestedInput,
  ): Promise<InterestedEntry> => {
    const res = await axiosInstance.post<InterestedEntry>(
      `/events/${eventId}/interested`,
      data,
    );
    return res.data;
  },

  /**
   * Remove interest from an event.
   */
  removeInterest: async (eventId: string): Promise<void> => {
    await axiosInstance.delete(`/events/${eventId}/interested`);
  },

  /**
   * Get all interested users for an event.
   */
  getByEvent: async (eventId: string): Promise<InterestedEntry[]> => {
    const res = await axiosInstance.get<InterestedEntry[]>(
      `/events/${eventId}/interested`,
    );
    return res.data;
  },
};
