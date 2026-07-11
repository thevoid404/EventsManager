import { axiosInstance } from '@/lib/axios';
import type { Event, Team, User } from '@/types';

export interface UserProfile {
  user: User;
  createdEvents: Event[];
  interestedEvents: Event[];
  createdTeams: Team[];
  joinedTeams: Team[];
}

export const profileService = {
  /**
   * Get the current user's full profile.
   */
  getMyProfile: async (): Promise<UserProfile> => {
    const res = await axiosInstance.get<UserProfile>('/profile/me');
    return res.data;
  },

  /**
   * Get a user's public profile by user ID.
   */
  getProfileById: async (userId: string): Promise<UserProfile> => {
    const res = await axiosInstance.get<UserProfile>(`/profile/${userId}`);
    return res.data;
  },

  /**
   * Update the current user's profile.
   */
  updateProfile: async (
    data: Partial<Pick<User, 'name' | 'department' | 'avatarUrl'>>,
  ): Promise<User> => {
    const res = await axiosInstance.patch<User>('/profile/me', data);
    return res.data;
  },
};
