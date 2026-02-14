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
  avatar?: string;
}
export interface UserTableProps {
  users: User[];
}