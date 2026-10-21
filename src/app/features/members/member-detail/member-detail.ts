// 📄 ไฟล์นี้ทำหน้าที่: หน้ารายละเอียดบัญชีสมาชิก (ผู้ใช้ทั่วไป) ทีละคน
// ดูข้อมูลส่วนตัวและสั่งระงับ/เปิดใช้งานบัญชีสมาชิกคนนั้น
import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Members as MembersService } from '../../../core/services/members';
import { MemberDetail as MemberDetailModel } from '../../../core/models/member.model';
import { AuthImage } from '../../../shared/auth-image/auth-image';
import { StatusBadge } from '../../../shared/status-badge/status-badge';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-member-detail',
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AuthImage,
    StatusBadge,
  ],
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.scss',
})
export class MemberDetail implements OnInit {
  member = signal<MemberDetailModel | null>(null);
  loading = signal(true);
  processing = signal(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: MembersService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: (res) => {
        this.member.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.snackBar.open(err?.error?.message ?? 'โหลดข้อมูลไม่สำเร็จ', 'ปิด', {
          duration: 3000,
        });
        this.router.navigate(['/members']);
      },
    });
  }

  fullName(m: MemberDetailModel): string {
    return [m.First_Name, m.Last_Name].filter(Boolean).join(' ') || m.Username;
  }

  genderLabel(gender: string | null): string {
    if (gender === 'Male') return 'ชาย';
    if (gender === 'Female') return 'หญิง';
    if (gender === 'Other') return 'อื่นๆ';
    return 'ไม่ระบุ';
  }

  toggleStatus(): void {
    const m = this.member();
    if (!m) return;
    const willSuspend = m.Account_Status === 'Active';
    const nextStatus = willSuspend ? 'Suspended' : 'Active';

    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: willSuspend ? 'ระงับบัญชีนี้?' : 'เปิดใช้งานบัญชีนี้?',
        message: willSuspend
          ? `คุณต้องการระงับบัญชีของ ${this.fullName(m)} ใช่หรือไม่ ผู้ใช้จะเข้าสู่ระบบไม่ได้จนกว่าจะเปิดใช้งานอีกครั้ง`
          : `คุณต้องการเปิดใช้งานบัญชีของ ${this.fullName(m)} อีกครั้งใช่หรือไม่`,
        confirmLabel: willSuspend ? 'ยืนยันระงับบัญชี' : 'ยืนยันเปิดใช้งาน',
        tone: willSuspend ? 'danger' : 'primary',
        icon: willSuspend ? 'block' : 'check_circle',
      },
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.processing.set(true);
      this.service.setStatus(m.Member_ID, nextStatus).subscribe({
        next: () => {
          this.processing.set(false);
          this.snackBar.open(
            nextStatus === 'Suspended' ? 'ระงับบัญชีแล้ว' : 'เปิดใช้งานบัญชีแล้ว',
            'ปิด',
            { duration: 3000 },
          );
          this.load();
        },
        error: (err) => {
          this.processing.set(false);
          this.snackBar.open(err?.error?.message ?? 'อัปเดตสถานะไม่สำเร็จ', 'ปิด', {
            duration: 3000,
          });
        },
      });
    });
  }
}
