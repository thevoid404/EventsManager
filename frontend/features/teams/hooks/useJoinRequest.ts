import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsService } from '@/services/teams.service';
import type { CreateJoinRequestInput } from '@/types';
import { toast } from 'sonner';

export const useJoinRequest = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJoinRequestInput) => teamsService.joinRequest(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', 'detail', teamId] });
      toast.success('Join request sent successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send join request');
    },
  });
};
