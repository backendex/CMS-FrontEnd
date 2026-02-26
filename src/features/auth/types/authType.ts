export interface AuthResponse {
  token: string;
}
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
// src/features/users/types/index.ts
export type UserStatus = 'Active' | 'In Active' | 'To Be Verified' | 'On Hold';
// src/features/users/api/index.ts
