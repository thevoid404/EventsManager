import { useQuery } from '@tanstack/react-query';
import { interestedService } from '@/services/interested.service';
import { eventKeys } from './queryKeys';

export function useInterestedUsers(eventId: string, enabled = true) {
  return useQuery({
    queryKey: eventKeys.interested(eventId),
    queryFn: () => interestedService.getByEvent(eventId),
    enabled: enabled && !!eventId,
  });
}
