import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsService } from '@/services/teams.service';
import { toast } from 'sonner';

export const useTeamJoinRequests = (teamId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['teams', teamId, 'join-requests'],
    queryFn: () => teamsService.getJoinRequests(teamId),
    enabled: !!teamId,
  });

  const acceptMutation = useMutation({
    mutationFn: (requestId: string) => teamsService.acceptRequest(teamId, requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId, 'join-requests'] });
      queryClient.invalidateQueries({ queryKey: ['teams', 'detail', teamId] });
      toast.success('Request accepted');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to accept request');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId: string) => teamsService.rejectRequest(teamId, requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId, 'join-requests'] });
      toast.success('Request rejected');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reject request');
    },
  });

  return {
    ...query,
    acceptMutation,
    rejectMutation,
  };
};
