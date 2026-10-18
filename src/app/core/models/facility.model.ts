export type FacilityType = 'Dormitory' | 'Room';

export interface Facility {
  Facility_ID: number;
  Facility_Name: string;
  Facility_Type: FacilityType;
}

export interface CreateFacilityRequest {
  name: string;
  type: FacilityType;
}
