import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Admins } from '../../../core/services/admins';
import { Auth } from '../../../core/services/auth';
import { AdminAccount } from '../../../core/models/admin.model';
import { AuthImage } from '../../../shared/auth-image/auth-image';
import { StatusBadge } from '../../../shared/status-badge/status-badge';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-admin-detail',
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    AuthImage,
    StatusBadge,
  ],
  templateUrl: './admin-detail.html',
  styleUrl: './admin-detail.scss',
})
export class AdminDetail implements OnInit {
  admin = signal<AdminAccount | null>(null);
  loading = signal(true);
  processing = signal(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: Admins,
    readonly auth: Auth,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: (res) => {
        this.admin.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.snackBar.open(err?.error?.message ?? 'โหลดข้อมูลไม่สำเร็จ', 'ปิด', {
          duration: 3000,
        });
        this.router.navigate(['/manage-admins']);
      },
    });
  }

  fullName(admin: AdminAccount): string {
    return [admin.First_Name, admin.Last_Name].filter(Boolean).join(' ') || admin.Username;
  }

  // 🚀 แก้ไขบัญชีตัวเอง หรือบัญชี Master Admin คนอื่นผ่านหน้านี้ไม่ได้ (เช็คตรงกับ backend)
  get canToggleStatus(): boolean {
    const a = this.admin();
    if (!a) return false;
    return a.User_Role !== 'Master_Admin' && a.Member_ID !== this.auth.currentUser()?.Member_ID;
  }

  toggleStatus(): void {
    const a = this.admin();
    if (!a) return;
    const willSuspend = a.Account_Status === 'Active';
    const nextStatus = willSuspend ? 'Suspended' : 'Active';

    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: willSuspend ? 'ระงับบัญชี Admin นี้?' : 'เปิดใช้งานบัญชี Admin นี้?',
        message: willSuspend
          ? `คุณต้องการระงับบัญชีของ ${this.fullName(a)} ใช่หรือไม่ จะเข้าสู่ระบบไม่ได้จนกว่าจะเปิดใช้งานอีกครั้ง`
          : `คุณต้องการเปิดใช้งานบัญชีของ ${this.fullName(a)} อีกครั้งใช่หรือไม่`,
        confirmLabel: willSuspend ? 'ยืนยันระงับบัญชี' : 'ยืนยันเปิดใช้งาน',
        tone: willSuspend ? 'danger' : 'primary',
        icon: willSuspend ? 'block' : 'check_circle',
      },
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.processing.set(true);
      this.service.setStatus(a.Member_ID, nextStatus).subscribe({
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
