import { api } from "@/lib/api";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from "../types/providerAuthTypes";

export const providerAuthService = {
  login: (credentials: LoginCredentials): Promise<LoginResponse> =>
    api.post<LoginResponse, LoginCredentials>(
      "/provider/auth/login",
      credentials
    ),

  register: (credentials: RegisterCredentials): Promise<RegisterResponse> =>
    api.post<RegisterResponse, RegisterCredentials>(
      "/provider/auth/register",
      credentials
    ),
};
