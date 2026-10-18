import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, LoginResponse } from '../models/auth.model';

const TOKEN_KEY = 'admin_web_token';
const USER_KEY = 'admin_web_user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly currentUserSignal = signal<AuthUser | null>(this.readStoredUser());
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  readonly isMasterAdmin = computed(() => this.currentUserSignal()?.role === 'Master_Admin');

  // 🚀 รูปโปรไฟล์ไม่ได้มากับตอน login (เลี่ยงไม่ให้ response ตอน login หนักเกินจำเป็น) — Shell
  // จะดึงมาเติมให้ตอนเปิดแอป และ ProfileScreen จะอัปเดตให้ทันทีตอนเปลี่ยนรูปใหม่ ไม่ต้องรีเฟรชหน้า
  private readonly profileImageSignal = signal<string | null>(null);
  readonly profileImage = this.profileImageSignal.asReadonly();

  setProfileImage(url: string | null): void {
    this.profileImageSignal.set(url);
  }

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((res) => {
        if (res.user.role !== 'Admin' && res.user.role !== 'Master_Admin') {
          throw new Error('บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานระบบ Admin');
        }
        this.setSession(res.token, res.user);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
    this.profileImageSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setSession(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
