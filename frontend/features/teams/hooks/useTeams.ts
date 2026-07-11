import { useQuery } from '@tanstack/react-query';
import { teamsService } from '@/services/teams.service';
import type { Team } from '@/types';

export const useTeams = (eventId: string) => {
  return useQuery<Team[], Error>({
    queryKey: ['teams', eventId],
    queryFn: () => teamsService.getByEvent(eventId),
    staleTime: 5 * 60 * 1000,
  });
};
