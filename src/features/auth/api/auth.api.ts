//import api from "@/lib/api";
import axios from "axios";

export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  success: boolean;
  token: string;
  mustChangePassword: boolean;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
}

// auth.api.ts
// export const login = async (credentials: { email: string; password: string }) => {
//   try {
//     const response = await axios.post("https://localhost:44351/api/auth/login", {
//       Email: credentials.email,     
//       Password: credentials.password 
//     });
//     return response.data;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     // Esto es vital para saber si el error es "Cuenta no activada"
//     console.error("Error del Servidor (400):", error.response?.data);
//     throw error.response?.data || error;
//   }
// };

se realizan comparaciones de los dos funciones para login
// auth.api.ts
export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axios.post("https://localhost:44351/api/auth/login", {
      Email: credentials.email,    // Usa 'Email' con E mayúscula
      Password: credentials.password // Usa 'Password' con P mayúscula
    });
    return response.data;
  } catch (error: any) {
    console.error("Error del Servidor (400):", error.response?.data);
    throw error.response?.data || error;
  }
};


