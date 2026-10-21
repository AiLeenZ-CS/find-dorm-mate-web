// 📄 ไฟล์นี้ทำหน้าที่: กำหนดรูปร่างข้อมูลผู้ใช้ที่ล็อกอินและ response ของ /api/auth/login
// จาก backend ใช้โดย Auth service เพื่อเก็บ session และตรวจสิทธิ์
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
