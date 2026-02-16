
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  status: UserStatus;
  lastModified: string;
  lastLogin: string;
  avatarUrl?: string;
  mustChangePassword: boolean; 
}
export interface AuthResponse {
  user: User;
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
