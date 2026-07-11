import { axiosInstance } from '@/lib/axios';
import type {
  CreateTeamInput,
  CreateJoinRequestInput,
  JoinRequest,
  Team,
} from '@/types';

export const teamsService = {
  /**
   * Get all teams for a specific event.
   */
  getByEvent: async (eventId: string): Promise<Team[]> => {
    const res = await axiosInstance.get<Team[]>(`/events/${eventId}/teams`);
    return res.data;
  },

  /**
   * Get a single team by ID.
   */
  getById: async (teamId: string): Promise<Team> => {
    const res = await axiosInstance.get<Team>(`/teams/${teamId}`);
    return res.data;
  },

  /**
   * Create a new team under an event.
   */
  create: async (eventId: string, data: CreateTeamInput): Promise<Team> => {
    const res = await axiosInstance.post<Team>(
      `/events/${eventId}/teams`,
      data,
    );
    return res.data;
  },

  /**
   * Submit a join request for a team.
   */
  joinRequest: async (
    teamId: string,
    data: CreateJoinRequestInput,
  ): Promise<JoinRequest> => {
    const res = await axiosInstance.post<JoinRequest>(
      `/teams/${teamId}/join-requests`,
      data,
    );
    return res.data;
  },

  /**
   * Get all pending join requests for a team (leader only).
   */
  getJoinRequests: async (teamId: string): Promise<JoinRequest[]> => {
    const res = await axiosInstance.get<JoinRequest[]>(
      `/teams/${teamId}/join-requests`,
    );
    return res.data;
  },

  /**
   * Accept a join request.
   */
  acceptRequest: async (
    teamId: string,
    requestId: string,
  ): Promise<JoinRequest> => {
    const res = await axiosInstance.patch<JoinRequest>(
      `/teams/${teamId}/join-requests/${requestId}/accept`,
    );
    return res.data;
  },

  /**
   * Reject a join request.
   */
  rejectRequest: async (
    teamId: string,
    requestId: string,
  ): Promise<JoinRequest> => {
    const res = await axiosInstance.patch<JoinRequest>(
      `/teams/${teamId}/join-requests/${requestId}/reject`,
    );
    return res.data;
  },
};
