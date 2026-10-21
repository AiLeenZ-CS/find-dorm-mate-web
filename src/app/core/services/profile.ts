// 📄 ไฟล์นี้ทำหน้าที่: เรียก backend API ของฟีเจอร์โปรไฟล์ของผู้ใช้ Admin เอง ทั้งดู/แก้ไข
// ข้อมูลส่วนตัว อัปโหลดรูปโปรไฟล์ เปลี่ยนรหัสผ่าน และขอรีเซ็ตรหัสผ่าน
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { MyProfile, UpdateProfileRequest } from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class Profile {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private readonly http: HttpClient) {}

  get(memberId: number): Observable<ApiResponse<MyProfile>> {
    return this.http.get<ApiResponse<MyProfile>>(`${this.baseUrl}/profile/${memberId}`);
  }

  update(data: UpdateProfileRequest): Observable<ApiResponse<MyProfile>> {
    return this.http.patch<ApiResponse<MyProfile>>(`${this.baseUrl}/profile`, data);
  }

  uploadAvatar(file: File): Observable<ApiResponse<{ path: string; previewUrl: string | null }>> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<ApiResponse<{ path: string; previewUrl: string | null }>>(
      `${this.baseUrl}/profile/avatar`,
      formData,
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  forgotPassword(email: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}/forgot-password`, { email });
  }
}
