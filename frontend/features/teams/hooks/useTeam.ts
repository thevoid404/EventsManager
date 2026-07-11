import { useQuery } from '@tanstack/react-query';
import { teamsService } from '@/services/teams.service';

export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: ['teams', 'detail', teamId],
    queryFn: () => teamsService.getById(teamId),
    enabled: !!teamId,
  });
};
