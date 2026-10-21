// 📄 ไฟล์นี้ทำหน้าที่: ไดอะล็อกยืนยันกลางที่ใช้ร่วมกันทุกหน้าก่อนทำรายการสำคัญ
// (ระงับ/เปิดใช้งานบัญชี, อนุมัติ, ปิด/เปิดเรื่องรายงาน ฯลฯ)
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// 🚀 Dialog ยืนยันกลางที่ใช้ร่วมกันทุกจุดที่ Admin กดทำรายการสำคัญ (ระงับ/เปิดใช้งานบัญชี,
// อนุมัติ, ปิด/เปิดเรื่องรายงาน ฯลฯ) กันการกดพลาดโดยไม่ตั้งใจ — แยก tone สี เพื่อให้รู้ทันทีว่า
// การกระทำนี้เป็นเชิงบวก (เปิดใช้งาน/อนุมัติ) หรือเชิงลบ/ย้อนกลับยาก (ระงับ/ปฏิเสธ)
export type ConfirmTone = 'primary' | 'danger';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialog>);

  get tone(): ConfirmTone {
    return this.data.tone ?? 'primary';
  }

  get icon(): string {
    return this.data.icon ?? (this.tone === 'danger' ? 'warning' : 'help_outline');
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
