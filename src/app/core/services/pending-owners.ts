import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OwnerAccount, OwnerDetail } from '../models/owner.model';
import { ApiResponse } from '../models/api-response.model';

// 🚀 ชื่อไฟล์/คลาสคงเดิม (PendingOwners) แต่ตอนนี้ครอบคลุมเจ้าของหอพักทุกสถานะ ไม่ใช่แค่ Pending แล้ว
@Injectable({
  providedIn: 'root',
})
export class PendingOwners {
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  constructor(private readonly http: HttpClient) {}

  list(search = '', status = 'Pending'): Observable<ApiResponse<OwnerAccount[]>> {
    let params = new HttpParams().set('status', status);
    if (search) params = params.set('search', search);
    return this.http.get<ApiResponse<OwnerAccount[]>>(`${this.baseUrl}/owners`, { params });
  }

  getById(ownerId: number): Observable<ApiResponse<OwnerDetail>> {
    return this.http.get<ApiResponse<OwnerDetail>>(`${this.baseUrl}/owners/${ownerId}`);
  }

  approve(ownerId: number): Observable<ApiResponse<{ status: string }>> {
    return this.http.patch<ApiResponse<{ status: string }>>(
      `${this.baseUrl}/owners/${ownerId}/approve`,
      {},
    );
  }

  reject(ownerId: number, adminNote: string): Observable<ApiResponse<{ status: string }>> {
    return this.http.patch<ApiResponse<{ status: string }>>(
      `${this.baseUrl}/owners/${ownerId}/reject`,
      { adminNote },
    );
  }

  setStatus(
    ownerId: number,
    accountStatus: 'Active' | 'Suspended',
  ): Observable<ApiResponse<OwnerAccount>> {
    return this.http.patch<ApiResponse<OwnerAccount>>(`${this.baseUrl}/owners/${ownerId}/status`, {
      accountStatus,
    });
  }
}
