import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

// 🚀 ป้ายแสดงสถานะ/สิทธิ์ทรงปุ่ม (แสดงผลอย่างเดียว ไม่ใช่ปุ่มกดได้) ใช้แทน mat-chip เดิมทั้งแอป
// เพราะ mat-chip ต้อง ::ng-deep ทับสไตล์ภายในเยอะมากกว่าจะดูเหมือนปุ่มได้ — ใช้ span ธรรมดา
// ควบคุมสไตล์เองเต็มที่ง่ายกว่า และทำให้ทุกหน้า (list + detail) หน้าตาตรงกันแน่นอน
export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'app-status-badge',
  imports: [MatIconModule],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
})
export class StatusBadge {
  label = input.required<string>();
  variant = input<BadgeVariant>('neutral');
  icon = input<string | null>(null);
}
