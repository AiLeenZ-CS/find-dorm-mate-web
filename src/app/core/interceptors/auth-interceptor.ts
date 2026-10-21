// 📄 ไฟล์นี้ทำหน้าที่: HTTP interceptor ที่แนบ JWT token เป็น Authorization header
// ให้ทุก request ที่ยิงไปหา backend และดักกรณี token หมดอายุ (401) เพื่อเด้งไปหน้า login
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../services/auth';

// 🚀 แนบ JWT ไปกับทุก request อัตโนมัติ + เด้งไปหน้า Login ถ้า Token หมดอายุ/ไม่ถูกต้อง
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const token = auth.getToken();

  const authorizedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authorizedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
