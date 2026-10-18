import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

// 🚀 เตือนทันทีถ้า build production แล้วลืมเปลี่ยน apiUrl จาก localhost เป็นโดเมนจริง
// (เคยเป็นแค่คอมเมนต์เตือนใน environment.prod.ts เฉยๆ ไม่มีอะไรเช็คจริง ทำให้พลาดได้ง่าย)
if (environment.production && environment.apiUrl.includes('localhost')) {
  console.warn(
    '⚠️ environment.prod.ts ยังชี้ apiUrl ไปที่ localhost อยู่ — ต้องเปลี่ยนเป็นโดเมนจริงก่อน deploy',
  );
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
