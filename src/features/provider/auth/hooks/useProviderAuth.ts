import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/useAuthContext";
import { providerAuthService } from "../services/providerAuthService";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  ApiErrorResponse,
} from "../types/providerAuthTypes";

export const useProviderLogin = () => {
  const { login } = useAuthContext();

  return useMutation<LoginResponse, ApiErrorResponse, LoginCredentials>({
    mutationFn: providerAuthService.login,
    onSuccess: (data) => {
      login(data.token, data.data);
    },
    onError: (error) => {
      console.error("Provider login failed:", error);
    },
  });
};

export const useProviderRegister = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  return useMutation<RegisterResponse, ApiErrorResponse, RegisterCredentials>({
    mutationFn: providerAuthService.register,
    onSuccess: (data) => {
      login(data.token, data.data);
      navigate("/provider/dashboard", { replace: true });
    },
    onError: (error) => {
      console.error("Provider registration failed:", error);
    },
  });
};
