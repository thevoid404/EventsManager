import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService, type UserProfile } from '@/services/profile.service';
import type { User } from '@/types';
import { toast } from 'sonner';

export const useProfile = () => {
  const queryClient = useQueryClient();

  const query = useQuery<UserProfile, Error>({
    queryKey: ['profile', 'me'],
    queryFn: profileService.getMyProfile,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Pick<User, 'name' | 'department' | 'avatarUrl'>>) =>
      profileService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<UserProfile>(['profile', 'me'], (old) => {
        if (!old) return old;
        return { ...old, user: { ...old.user, ...updatedUser } };
      });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  return {
    ...query,
    updateMutation,
  };
};
