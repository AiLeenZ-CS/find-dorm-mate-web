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
