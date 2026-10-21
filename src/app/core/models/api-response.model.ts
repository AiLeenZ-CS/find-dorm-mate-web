// 📄 ไฟล์นี้ทำหน้าที่: กำหนดรูปร่างมาตรฐานของ response ที่ backend ทุก endpoint ส่งกลับมา
// (message, data, meta สำหรับ pagination) ใช้เป็น generic wrapper type ทั่วทั้งแอป
export interface ApiResponseMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  meta?: ApiResponseMeta;
}
