'use client';

import { authService } from '@/services/auth.service';
import type { User } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const AUTH_QUERY_KEY = ['auth', 'me'] as const;

/**
 * Central auth hook. Provides the current user, auth state,
 * and login/logout helpers. Built on TanStack Query so the
 * user object is cached and shared across the whole app.
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authService.getMe,
    enabled: authService.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logout = () => {
    authService.logout();
    queryClient.clear();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    isError,
    logout,
  };
}
