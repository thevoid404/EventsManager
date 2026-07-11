import { axiosInstance } from '@/lib/axios';
import type { AuthResponse, LoginInput, RegisterInput } from '@/types';

export const authService = {
  /**
   * Login with @seu.edu.bd email and password.
   * Stores the returned JWT in localStorage.
   */
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>('/auth/login', data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', res.data.token);
    }
    return res.data;
  },

  /**
   * Register a new user. Only @seu.edu.bd emails are accepted.
   */
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>('/auth/register', data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', res.data.token);
    }
    return res.data;
  },

  /**
   * Fetch the currently authenticated user's profile.
   */
  getMe: async () => {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
  },

  /**
   * Clear token and log out client-side.
   */
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  /**
   * Check if the user is authenticated (token present).
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },
};
