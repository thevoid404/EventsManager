import { useQuery } from '@tanstack/react-query';
import { eventsService } from '@/services/events.service';
import { eventKeys } from './queryKeys';

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsService.getById(id),
    enabled: !!id,
  });
}
