// 📄 ไฟล์นี้ทำหน้าที่: กำหนดรูปร่างข้อมูลหอพักที่ backend (/api/admin/dormitories) ส่งกลับมา
// ทั้งแบบย่อสำหรับตารางรายชื่อและแบบเต็มสำหรับหน้ารายละเอียด/อนุมัติหอ
// 🚀 ข้อมูลย่อสำหรับตาราง/การ์ดในหน้ารายชื่อ (รายละเอียดเต็มอยู่ที่ DormitoryDetail)
export interface DormitoryListItem {
  Dorm_ID: number;
  Dorm_Name: string;
  Address: string | null;
  Dorm_Type: string | null;
  Dorm_Images: string | null;
  Approval_Status: 'Pending' | 'Approved' | 'Rejected';
  Dorm_Status: 'Open' | 'Maintenance' | 'Closed';
  Created_At: string;
  Owner: {
    Owner_ID: number;
    Username: string;
  } | null;
}

export interface DormitoryRoomType {
  Room_Type_ID: number;
  Room_Type_Name: string | null;
  Room_Type: string | null;
  Price_Per_Month: string | null;
  Total_Rooms: number | null;
  Remaining_Rooms: number | null;
  Room_Status: 'Available' | 'Full';
}

export interface DormitoryDetail {
  Dorm_ID: number;
  Dorm_Name: string;
  Address: string | null;
  Ownership_Proof_Image: string | null;
  Approval_Status: 'Pending' | 'Approved' | 'Rejected';
  Admin_Note: string | null;
  Latitude: string | null;
  Longitude: string | null;
  Dorm_Type: string | null;
  Dorm_Images: string | null;
  Deposit_Fee: string | null;
  Insurance_Fee: string | null;
  Contract_Duration: number | null;
  Is_Pet_Friendly: boolean;
  Is_Smoking_Allowed: boolean;
  Contact_Info: string | null;
  Dorm_Status: 'Open' | 'Maintenance' | 'Closed';
  Water_Rate: string | null;
  Electric_Rate: string | null;
  Created_At: string;
  Updated_At: string;
  Owner: {
    Owner_ID: number;
    Username: string;
    Email: string;
    Phone: string | null;
  } | null;
  Facilities: { Facility_ID: number; Facility_Name: string }[];
  Room_Types: DormitoryRoomType[];
}
