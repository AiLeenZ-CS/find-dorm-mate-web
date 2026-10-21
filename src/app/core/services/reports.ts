// 📄 ไฟล์นี้ทำหน้าที่: เรียก backend API ของฟีเจอร์จัดการรายงาน (reports) ทั้งดูรายชื่อ
// (กรองตามสถานะ) ดูรายละเอียด และอัปเดตสถานะรายงานว่าจัดการแล้วหรือยัง
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserReport } from '../models/report.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class Reports {
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  constructor(private readonly http: HttpClient) {}

  list(status = 'All'): Observable<ApiResponse<UserReport[]>> {
    let params = new HttpParams();
    if (status && status !== 'All') params = params.set('status', status);
    return this.http.get<ApiResponse<UserReport[]>>(`${this.baseUrl}/reports`, { params });
  }

  detail(reportId: number): Observable<ApiResponse<UserReport>> {
    return this.http.get<ApiResponse<UserReport>>(`${this.baseUrl}/reports/${reportId}`);
  }

  updateStatus(
    reportId: number,
    status: 'Pending' | 'Resolved',
  ): Observable<ApiResponse<UserReport>> {
    return this.http.patch<ApiResponse<UserReport>>(
      `${this.baseUrl}/reports/${reportId}/status`,
      { status },
    );
  }
}
