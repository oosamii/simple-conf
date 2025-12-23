import type { User, Department, LoginResponse, MeResponse, RegisterResponse } from '@simpleconf/shared';
import { apiClient } from '../client';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
  department: Department;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/api/auth/login', { email, password });
  },

  async register(data: RegisterInput): Promise<User> {
    const response = await apiClient.post<RegisterResponse>('/api/auth/register', data);
    return response.user;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<MeResponse>('/api/auth/me');
    return response.user;
  },
};
