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
