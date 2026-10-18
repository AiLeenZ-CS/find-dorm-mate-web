// 🚀 โปรไฟล์ของตัวเอง (ใช้ได้ทั้ง Admin/Master Admin เพราะอยู่ตาราง D1_Members เดียวกับ Member)
// รูปร่างตรงกับ select ของ getMemberProfile/updateMemberProfile ใน auth.controller.ts
export interface MyProfile {
  Member_ID: number;
  First_Name: string | null;
  Last_Name: string | null;
  Nickname: string | null;
  Birthdate: string | null;
  Email: string;
  Phone: string | null;
  User_Role: string;
  Gender: string | null;
  Profile_Image: string | null;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string | null;
}
