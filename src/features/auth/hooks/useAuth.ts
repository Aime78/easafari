import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/useAuthContext";
import { authService } from "../services/authService";
import type {
  LoginCredentials,
  LoginResponse,
  ApiErrorResponse,
} from "../types/authTypes";

export const useLogin = () => {
  const { login } = useAuthContext();

  return useMutation<LoginResponse, ApiErrorResponse, LoginCredentials>({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.token, data.data);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  return () => {
    logout();
    navigate("/login", { replace: true });
  };
};

export { useAuthContext as useAuth } from "@/contexts/useAuthContext";
