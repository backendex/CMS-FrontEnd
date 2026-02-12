import axios from "@/lib/api"
import { SiteType } from "@/features/sites/types/siteType";
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;        
  token: string;
  userId: number;         
  mustChangePassword: boolean;
  fullName: string;
  role: string;
  message: string;
}

export interface MeResponse {
  userId: number;
  fullName: string;
  allowedSites: SiteType[];
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post("https://localhost:44351/api/auth/login", credentials);
  const data = response.data;

  if (data.success && data.userId) {
    localStorage.setItem("userId", data.userId.toString());
    localStorage.setItem("token", data.token);
  }
  
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getMe = async (siteId: string): Promise<MeResponse> => {
  const { data } = await axios.get(
    "https://localhost:44351/api/site/user-access"
  );
  return data;
};