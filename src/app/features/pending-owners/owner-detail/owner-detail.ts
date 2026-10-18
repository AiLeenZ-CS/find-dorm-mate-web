import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PendingOwners as PendingOwnersService } from '../../../core/services/pending-owners';
import { OwnerDetail as OwnerDetailModel } from '../../../core/models/owner.model';
import { RejectOwnerDialog } from '../reject-owner-dialog/reject-owner-dialog';
import { AuthImage } from '../../../shared/auth-image/auth-image';
import { ImageViewer } from '../../../shared/services/image-viewer';
import { StatusBadge, BadgeVariant } from '../../../shared/status-badge/status-badge';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

const STATUS_LABEL: Record<string, string> = {
  Pending: 'รอตรวจสอบ',
  Approved: 'อนุมัติแล้ว',
  Rejected: 'ถูกปฏิเสธ',
};

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'danger',
};

const STATUS_ICON: Record<string, string> = {
  Pending: 'hourglass_top',
  Approved: 'check_circle',
  Rejected: 'cancel',
};

@Component({
  selector: 'app-owner-detail',
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
  templateUrl: './owner-detail.html',
  styleUrl: './owner-detail.scss',
})
export class OwnerDetail implements OnInit {
  owner = signal<OwnerDetailModel | null>(null);
  loading = signal(true);
  processing = signal(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: PendingOwnersService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly imageViewer: ImageViewer,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: (res) => {
        this.owner.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.snackBar.open(err?.error?.message ?? 'โหลดข้อมูลไม่สำเร็จ', 'ปิด', {
          duration: 3000,
        });
        this.router.navigate(['/owners']);
      },
    });
  }

  fullName(o: OwnerDetailModel): string {
    return [o.First_Name, o.Last_Name].filter(Boolean).join(' ') || o.Username;
  }

  statusLabel(status: string): string {
    return STATUS_LABEL[status] ?? status;
  }

  statusVariant(status: string): BadgeVariant {
    return STATUS_VARIANT[status] ?? 'neutral';
  }

  statusIcon(status: string): string {
    return STATUS_ICON[status] ?? 'help';
  }

  // 🚀 เปิดรูปบัตรประชาชนแบบเต็มในแท็บใหม่
  viewFullIdCard(): void {
    const path = this.owner()?.ID_Card_Image;
    if (!path) return;

    this.imageViewer.openInNewTab(path).subscribe({
      error: () => {
        this.snackBar.open('เปิดรูปบัตรประชาชนไม่สำเร็จ', 'ปิด', { duration: 3000 });
      },
    });
  }

  approve(): void {
    const o = this.owner();
    if (!o) return;

    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'อนุมัติคำร้องนี้?',
        message: `คุณต้องการอนุมัติคำร้องเป็นเจ้าของหอพักของ ${this.fullName(o)} ใช่หรือไม่ หลังอนุมัติแล้วผู้ใช้จะเข้าสู่ระบบและลงประกาศหอพักได้ทันที`,
        confirmLabel: 'ยืนยันอนุมัติ',
        tone: 'primary',
        icon: 'check_circle',
      },
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.processing.set(true);
      this.service.approve(o.Owner_ID).subscribe({
        next: () => {
          this.processing.set(false);
          this.snackBar.open('อนุมัติสำเร็จ', 'ปิด', { duration: 3000 });
          this.load();
        },
        error: (err) => {
          this.processing.set(false);
          this.snackBar.open(err?.error?.message ?? 'อนุมัติไม่สำเร็จ', 'ปิด', { duration: 3000 });
        },
      });
    });
  }

  reject(): void {
    const o = this.owner();
    if (!o) return;

    const ref = this.dialog.open(RejectOwnerDialog, {
      width: '420px',
      data: { ownerName: this.fullName(o) },
    });

    ref.afterClosed().subscribe((adminNote: string | undefined) => {
      if (!adminNote) return;
      this.processing.set(true);
      this.service.reject(o.Owner_ID, adminNote).subscribe({
        next: () => {
          this.processing.set(false);
          this.snackBar.open('ปฏิเสธคำร้องแล้ว', 'ปิด', { duration: 3000 });
          this.load();
        },
        error: (err) => {
          this.processing.set(false);
          this.snackBar.open(err?.error?.message ?? 'ปฏิเสธไม่สำเร็จ', 'ปิด', { duration: 3000 });
        },
      });
    });
  }

  toggleAccountStatus(): void {
    const o = this.owner();
    if (!o) return;
    const willSuspend = o.Account_Status === 'Active';
    const nextStatus = willSuspend ? 'Suspended' : 'Active';

    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: willSuspend ? 'ระงับบัญชีนี้?' : 'เปิดใช้งานบัญชีนี้?',
        message: willSuspend
          ? `คุณต้องการระงับบัญชีของ ${this.fullName(o)} ใช่หรือไม่ เจ้าของหอจะเข้าสู่ระบบไม่ได้จนกว่าจะเปิดใช้งานอีกครั้ง`
          : `คุณต้องการเปิดใช้งานบัญชีของ ${this.fullName(o)} อีกครั้งใช่หรือไม่`,
        confirmLabel: willSuspend ? 'ยืนยันระงับบัญชี' : 'ยืนยันเปิดใช้งาน',
        tone: willSuspend ? 'danger' : 'primary',
        icon: willSuspend ? 'block' : 'check_circle',
      },
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.processing.set(true);
      this.service.setStatus(o.Owner_ID, nextStatus).subscribe({
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
