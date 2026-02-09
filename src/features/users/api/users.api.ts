import {api} from "@/lib/api";
// import axios from "axios";
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
export interface ChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUser = async(siteId: string, userData: any) => {
  const response = await api.post(`https://localhost:44351/api/auth/admin/${siteId}/create-user`, userData);
  return response.data;
};

export const getUsers = async (siteId: string): Promise<User[]> => {
  try {
    const res = await api.get(`https://localhost:44351/api/auth/${siteId}/users`); 
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
// export const changePassword = async (dto: any) => {
//   // 1. Define la URL completa de tu backend
//   const token = localStorage.getItem("token");
//   const BACKEND_URL = "https://localhost:44351/api/auth/changePass"; 

//   console.log("Intentando conectar a:", BACKEND_URL);
//   console.log("Datos enviados:", dto);

//   return await api.post(BACKEND_URL, dto, {
//     headers: {
//       Authorization: `Bearer ${token}` // Si token es null, aquí dirá "Bearer null" -> Error 401
//     }
//   });
// };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const changePassword = async (dto: any) => {
  return await api.post("/auth/changePass", dto);
};

