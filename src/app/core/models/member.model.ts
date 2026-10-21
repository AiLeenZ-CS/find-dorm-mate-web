// 📄 ไฟล์นี้ทำหน้าที่: กำหนดรูปร่างข้อมูลบัญชีสมาชิก (Member) ตามที่ backend
// (/api/admin/members) ส่งกลับมา ทั้งแบบย่อสำหรับตารางและแบบเต็มสำหรับหน้ารายละเอียด
export interface MemberAccount {
  Member_ID: number;
  Username: string;
  Email: string;
  First_Name: string | null;
  Last_Name: string | null;
  Phone: string | null;
  Profile_Image: string | null;
  Gender: string | null;
  User_Role: 'Member' | 'Admin' | 'Master_Admin';
  Account_Status: 'Active' | 'Suspended';
  Created_At: string;
}

export interface MemberDetail extends MemberAccount {
  Nickname: string | null;
  Birthdate: string | null;
  Is_Profile_Completed: boolean;
  Updated_At: string;
}
