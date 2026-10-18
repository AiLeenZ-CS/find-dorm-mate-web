import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MemberAccount, MemberDetail } from '../models/member.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class Members {
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  constructor(private readonly http: HttpClient) {}

  list(search = '', status = 'All'): Observable<ApiResponse<MemberAccount[]>> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (status && status !== 'All') params = params.set('status', status);
    return this.http.get<ApiResponse<MemberAccount[]>>(`${this.baseUrl}/members`, { params });
  }

  getById(memberId: number): Observable<ApiResponse<MemberDetail>> {
    return this.http.get<ApiResponse<MemberDetail>>(`${this.baseUrl}/members/${memberId}`);
  }

  setStatus(
    memberId: number,
    accountStatus: 'Active' | 'Suspended',
  ): Observable<ApiResponse<MemberAccount>> {
    return this.http.patch<ApiResponse<MemberAccount>>(
      `${this.baseUrl}/members/${memberId}/status`,
      { accountStatus },
    );
  }
}
