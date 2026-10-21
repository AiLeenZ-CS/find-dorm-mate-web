// 📄 ไฟล์นี้ทำหน้าที่: กันไม่ให้เข้าหน้าใดๆ ในแอดมิน (ยกเว้น /login) ถ้ายังไม่ได้ล็อกอิน
// ใช้เป็น canActivate ของ route หลัก ('') ใน app.routes.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
