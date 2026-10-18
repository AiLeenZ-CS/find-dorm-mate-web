import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminAccount, CreateAdminRequest } from '../models/admin.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class Admins {
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<ApiResponse<AdminAccount[]>> {
    return this.http.get<ApiResponse<AdminAccount[]>>(`${this.baseUrl}/admins`);
  }

  getById(memberId: number): Observable<ApiResponse<AdminAccount>> {
    return this.http.get<ApiResponse<AdminAccount>>(`${this.baseUrl}/admins/${memberId}`);
  }

  create(payload: CreateAdminRequest): Observable<ApiResponse<AdminAccount>> {
    return this.http.post<ApiResponse<AdminAccount>>(`${this.baseUrl}/admins`, payload);
  }

  setStatus(
    memberId: number,
    accountStatus: 'Active' | 'Suspended',
  ): Observable<ApiResponse<AdminAccount>> {
    return this.http.patch<ApiResponse<AdminAccount>>(`${this.baseUrl}/admins/${memberId}`, {
      accountStatus,
    });
  }
}
