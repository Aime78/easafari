import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/lib/api';
import { useAuthContext } from '@/contexts/AuthContext';
import type { LoginCredentials, LoginResponse, ApiErrorResponse } from '@/types/auth.type';

export const useLogin = () => {
  const { login } = useAuthContext();

  return useMutation<LoginResponse, ApiErrorResponse, LoginCredentials>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.token, data.data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  return () => {
    logout();
    navigate('/login', { replace: true });
  };
};

export { useAuthContext as useAuth } from '@/contexts/AuthContext';
