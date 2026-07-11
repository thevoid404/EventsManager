import { useMutation, useQueryClient } from '@tanstack/react-query';
import { interestedService } from '@/services/interested.service';
import { toast } from 'sonner';
import { eventKeys } from './queryKeys';

export function useMarkInterested(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (interestText: string) =>
      interestedService.markInterested(eventId, { interestText }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.interested(eventId) });
      toast.success("You're now interested in this event!");
    },
    onError: () => {
      toast.error('Failed to mark interest. Please try again.');
    },
  });
}
