import { useQuery } from '@tanstack/react-query';
import { eventsService } from '@/services/events.service';
import type { EventsQueryParams } from '@/types';
import { eventKeys } from './queryKeys';

export function useEvents(params?: EventsQueryParams) {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => eventsService.getAll(params),
  });
}
