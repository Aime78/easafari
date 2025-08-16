import { api } from "@/lib/api";
import type { LoginCredentials, LoginResponse } from "../types/authTypes";

export const authService = {
  login: (credentials: LoginCredentials): Promise<LoginResponse> =>
    api.post<LoginResponse, LoginCredentials>("/auth/login", credentials),
};
