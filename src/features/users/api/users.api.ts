import api from "@/lib/api";

export interface CreateUserDto {
  email: string;
  fullName: string;
  rolId: number;
}

export const createUser = async (data: CreateUserDto) => {
  const response = await api.post("/auth/admin/create-user", data);
  return response.data;
};

console.log("users.api.ts cargado");
