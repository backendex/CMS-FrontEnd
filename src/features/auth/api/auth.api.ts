import api from "@/lib/api"
import {LoginRequest, LoginResponse} from "@/features/auth/types/authType"

const BASE_URL = "/auth";

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post(`${BASE_URL}/login`, credentials);
  const data = res.data;

  if (data.success && data.userId) {
    localStorage.setItem("userId", data.userId.toString());
    localStorage.setItem("token", data.token);
  }
  return data;
};
                                                                
// eslint-disable-next-line @typescript-eslint/no-explicit-any 
export const changePassword = async (dto: any) => {
  return await api.post(`${BASE_URL}/changePass`, dto);
};


