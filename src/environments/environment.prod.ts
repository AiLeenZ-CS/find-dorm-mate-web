// 📄 ไฟล์นี้ทำหน้าที่: ค่าคอนฟิกสภาพแวดล้อมสำหรับ production build ชี้ apiUrl ไปที่โดเมน
// backend จริงบน Railway ใช้แทน environment.ts ตอน build ด้วย fileReplacements
export const environment = {
  production: true,
  apiUrl: 'https://find-dorm-mate-backend-production.up.railway.app/api',
};
