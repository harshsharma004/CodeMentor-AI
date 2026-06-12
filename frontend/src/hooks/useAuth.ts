import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import type { AuthResponse } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post<AuthResponse>('/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const res = await api.post<AuthResponse>('/auth/register', data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
    },
  });
}

export function useLogout() {
  const { logout, refreshToken } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    },
    onSettled: () => logout(),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post('/auth/forgot-password', { email });
      return res.data;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      const res = await api.post('/auth/reset-password', data);
      return res.data;
    },
  });
}

export { getApiErrorMessage };
