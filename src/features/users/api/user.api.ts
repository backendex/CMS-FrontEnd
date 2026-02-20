/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api"
import {User} from "@/features/users/types/userType"
const BASE_URL = "https://localhost:44351/api/auth";

export const getUsers = async (siteId: string): Promise<User[]> => {
  try {
    const res = await api.get(`${BASE_URL}/users`); 
    console.log("Status:", res.status);
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      console.error("Data error:", error.response.data);
    } else if (error.request) {
      console.error("Network error: No se pudo contactar con el servidor.");
    }
    throw error;
  }
};

export const createUser = async(userData: any) => {
  const res = await api.post(`${BASE_URL}/create-user`, userData);
  return res.data;
};
