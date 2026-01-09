// Si tu archivo está en src/features/auth/api/login.ts
import { api } from "@/lib/api";;
import type { AuthResponse } from '../types';

export const loginRequest = async (credentials: { email: string; pass: string }) => {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials);
  return data;
};