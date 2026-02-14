import api from "@/lib/api"
import {LoginRequest, LoginResponse,User } from "@/features/auth/types/authType"

const BASE_URL = "https://localhost:44351/api/auth";

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
export const createUser = async(userData: any) => {
  const res = await api.post(`${BASE_URL}/create-user`, userData);
  return res.data;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getUsers = async (siteId: string): Promise<User[]> => {
  try {
    const res = await api.get(`${BASE_URL}/users`); 
    console.log("Status:", res.status);
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      // El servidor respondió con un error (404, 500, etc)
      console.error("Data error:", error.response.data);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta (CORS o puerto mal)
      console.error("Network error: No se pudo contactar con el servidor.");
    }
    throw error;
  }
};;                                                                   
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const changePassword = async (dto: any) => {
  return await api.post(`${BASE_URL}/changePass`, dto);
};


