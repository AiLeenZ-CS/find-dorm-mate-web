import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateFacilityRequest, Facility } from '../models/facility.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class Facilities {
  private readonly baseUrl = `${environment.apiUrl}/admin/facilities`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<ApiResponse<Facility[]>> {
    return this.http.get<ApiResponse<Facility[]>>(this.baseUrl);
  }

  create(payload: CreateFacilityRequest): Observable<ApiResponse<Facility>> {
    return this.http.post<ApiResponse<Facility>>(this.baseUrl, payload);
  }

  delete(facilityId: number): Observable<ApiResponse<{ Facility_ID: number }>> {
    return this.http.delete<ApiResponse<{ Facility_ID: number }>>(`${this.baseUrl}/${facilityId}`);
  }
}
