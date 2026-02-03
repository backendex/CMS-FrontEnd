import api from "@/lib/api";
import axios from "axios";
export interface CreateUserDto {
  email: string;
  fullName: string;
  rolId: number;
}
export interface User {
  id: string;           
  fullName: string;
  email: string;
  rolId: number;        
  emailConfirmed: boolean;
}
// users.api.ts (o dto.ts)
export interface ChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUser = async (userData: any) => {
  const response = await axios.post("https://localhost:44351/api/auth/admin/create-user", userData);
  return response.data;
};

export const getUsers = async (): Promise<User[]> => {
  try {
    // Revisa si falta el prefijo "/auth" antes de "/users"
    const res = await api.get("https://localhost:44351/api/auth/users"); 
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
                                                                      
// En tu servicio de API (users.api.ts o similar)
export const changePassword = async (dto) => {
  // 1. Define la URL completa de tu backend
  const token = localStorage.getItem("token");
  const BACKEND_URL = "https://localhost:44351/api/auth/changePass"; 

  console.log("🚀 Intentando conectar a:", BACKEND_URL);
  console.log("📦 Datos enviados:", dto);

  return await axios.post(BACKEND_URL, dto, {
    headers: {
      Authorization: `Bearer ${token}` // Si token es null, aquí dirá "Bearer null" -> Error 401
    }
  });
};

