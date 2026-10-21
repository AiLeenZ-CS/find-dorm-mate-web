// 📄 ไฟล์นี้ทำหน้าที่: กำหนดรูปร่างข้อมูลเจ้าของหอพัก (Owner) ที่ backend
// (/api/admin/owners) ส่งกลับมา ใช้ทั้งตอนรออนุมัติและดูรายละเอียดบัญชีเจ้าของหอ
// 🚀 ข้อมูลย่อสำหรับตาราง/การ์ดในหน้ารายชื่อ (รายละเอียดเต็มอยู่ที่ OwnerDetail)
export interface OwnerAccount {
  Owner_ID: number;
  Username: string;
  Email: string;
  First_Name: string | null;
  Last_Name: string | null;
  Profile_Image: string | null;
  Submitted_Date: string;
  Status: 'Pending' | 'Approved' | 'Rejected';
  Account_Status: 'Active' | 'Suspended';
}

export interface OwnerDetail extends OwnerAccount {
  Phone: string | null;
  ID_Card_No: string | null;
  ID_Card_Image: string | null;
  Approved_Date: string | null;
  Admin_Note: string | null;
  Google_ID: string | null;
}
