export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  data: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface ApiError {
  response?: {
    status: number;
    statusText: string;
    data?: {
      message?: string;
    };
  };
  message?: string;
  code?: string;
}

export interface ApiErrorResponse extends Error {
  response?: {
    status: number;
    statusText: string;
    data?: {
      message?: string;
    };
  };
  code?: string;
}
