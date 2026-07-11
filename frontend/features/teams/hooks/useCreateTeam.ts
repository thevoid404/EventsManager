import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsService } from '@/services/teams.service';
import type { CreateTeamInput } from '@/types';
import { toast } from 'sonner';

export const useCreateTeam = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamInput) => teamsService.create(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', eventId] });
      // Also invalidate profile joined/created teams
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create team');
    },
  });
};
