// import api from "@/lib/api";
import axios from "axios";
export interface CreateUserDto {
  email: string;
  fullName: string;
  rolId: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUser = async (userData: any) => {
  // Recuperamos el token que guardaste cuando el Admin hizo login
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const token = localStorage.getItem("token"); 

  // const response = await axios.post("https://localhost:44351/api/auth/admin/create-user", userData, {
  //   headers: {
  //           ...(token && { Authorization: `Bearer ${token}` })
  //       // Authorization: `Bearer ${localStorage.getItem("token")}`
  //   }
  // });

  // Comenta el header de Authorization temporalmente para asegurar una petición limpia
  const response = await axios.post("https://localhost:44351/api/auth/admin/create-user", userData);
  return response.data;
};

console.log("users.api.ts cargado");


