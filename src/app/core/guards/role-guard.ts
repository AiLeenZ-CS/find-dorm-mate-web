// 📄 ไฟล์นี้ทำหน้าที่: กันไม่ให้ Admin ธรรมดาเข้าหน้าที่สงวนไว้สำหรับ Master Admin
// เช่นหน้า manage-admins ใน app.routes.ts ถ้าสิทธิ์ไม่พอจะเด้งกลับ /dashboard
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

// 🚀 ใช้กับหน้าที่ต้องเป็น Master Admin เท่านั้น (เช่น จัดการบัญชี Admin)
export const roleGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isMasterAdmin()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
