import api from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  token: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", data);
  return res.data;
};
