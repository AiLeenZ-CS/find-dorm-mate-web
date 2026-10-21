// 📄 ไฟล์นี้ทำหน้าที่: กำหนดรูปร่างข้อมูลสิ่งอำนวยความสะดวก (facility) ตามที่ backend
// (/api/admin/facilities) ส่งกลับมา และ payload ที่ใช้ตอนสร้าง facility ใหม่
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
