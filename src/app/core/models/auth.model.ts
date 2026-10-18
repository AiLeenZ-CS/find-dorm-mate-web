export type UserRole = 'Member' | 'Admin' | 'Master_Admin' | 'Owner';

export interface AuthUser {
  Member_ID: number;
  email: string;
  username: string;
  role: UserRole;
  status?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}
