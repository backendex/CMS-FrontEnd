export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  status: UserStatus;
  lastModified: string;
  lastLogin: string;
  avatarUrl?: string;
  MustChangePassword: boolean; 
}
export interface AuthResponse {
  user: User;
  token: string;
}
// src/features/users/types/index.ts
export type UserStatus = 'Active' | 'In Active' | 'To Be Verified' | 'On Hold';
// src/features/users/api/index.ts
export { createUser } from "@/features/users/api/users.api";
