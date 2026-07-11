import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsService } from '@/services/events.service';
import { eventKeys } from './queryKeys';
import { toast } from 'sonner';
import type { CreateEventInput } from '@/types';

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventInput) => eventsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: () => {
      toast.error('Failed to create event. Please try again.');
    },
  });
}
