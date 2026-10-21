// 📄 ไฟล์นี้ทำหน้าที่: root component ของแอป ทำหน้าที่แค่เป็นเปลือก (shell) ที่มี RouterOutlet
// ให้ Angular router สลับหน้าตาม route ที่ตั้งไว้ใน app.routes.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('admin-web');
}
