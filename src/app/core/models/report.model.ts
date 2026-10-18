export interface UserReport {
  Report_ID: number;
  Reason: string | null;
  Status: 'Pending' | 'Resolved';
  Reported_At: string;
  Closed_At: string | null;
  // 🚀 ผู้รายงานตอนนี้เป็นเจ้าของหอ (Owner) เท่านั้น — backend resolve มาจาก D2_Owners
  // ไม่ใช่ D1_Members แล้ว จึงได้ Owner_ID แทน Member_ID
  Reporter: { Owner_ID: number; Username: string; Email: string } | null;
  Reported_User: { Member_ID: number; Username: string; Email: string } | null;
  Booking: {
    Booking_ID: number;
    Dorm: { Dorm_Name: string } | null;
    Room_Type: { Room_Type_Name: string | null } | null;
  } | null;
}
