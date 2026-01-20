//import api from "@/lib/api";
import axios from "axios";
export interface LoginResponse {
  Success: boolean;
  Token: string;
  mustChangePassword: boolean;
  Message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  User?: any;
}
export interface LoginRequest {
  Email: string;
  Password: string;
}

// ... otras interfaces

// Cambiamos 'credentials' para que use el tipo LoginRequest (Mayúsculas)
export const login = async (credentials: LoginRequest) => {
  try {
    // Enviamos directamente 'credentials' porque ya vienen con las llaves correctas
    const response = await axios.post("https://localhost:44351/api/auth/login", credentials);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error del Servidor:", error.response?.data);
    throw error;
  }
};

