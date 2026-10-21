// 📄 ไฟล์นี้ทำหน้าที่: เรียก backend API ของฟีเจอร์จัดการหอพัก ทั้งดูรายชื่อ/รายละเอียด
// และอนุมัติหรือปฏิเสธคำขอลงทะเบียนหอพักจากเจ้าของหอ
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DormitoryDetail, DormitoryListItem } from '../models/dormitory.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class Dormitories {
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  constructor(private readonly http: HttpClient) {}

  list(search = '', status = 'Pending'): Observable<ApiResponse<DormitoryListItem[]>> {
    let params = new HttpParams().set('status', status);
    if (search) params = params.set('search', search);
    return this.http.get<ApiResponse<DormitoryListItem[]>>(`${this.baseUrl}/dormitories`, {
      params,
    });
  }

  getById(dormId: number): Observable<ApiResponse<DormitoryDetail>> {
    return this.http.get<ApiResponse<DormitoryDetail>>(`${this.baseUrl}/dormitories/${dormId}`);
  }

  approve(dormId: number): Observable<ApiResponse<{ status: string }>> {
    return this.http.patch<ApiResponse<{ status: string }>>(
      `${this.baseUrl}/dormitories/${dormId}/approve`,
      {},
    );
  }

  reject(dormId: number, adminNote: string): Observable<ApiResponse<{ status: string }>> {
    return this.http.patch<ApiResponse<{ status: string }>>(
      `${this.baseUrl}/dormitories/${dormId}/reject`,
      { adminNote },
    );
  }
}
