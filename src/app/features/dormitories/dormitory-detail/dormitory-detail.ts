import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dormitories as DormitoriesService } from '../../../core/services/dormitories';
import { DormitoryDetail as DormitoryDetailModel } from '../../../core/models/dormitory.model';
import { RejectDormitoryDialog } from '../reject-dormitory-dialog/reject-dormitory-dialog';
import { AuthImage } from '../../../shared/auth-image/auth-image';
import { ImageViewer } from '../../../shared/services/image-viewer';
import { StatusBadge, BadgeVariant } from '../../../shared/status-badge/status-badge';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

const STATUS_LABEL: Record<string, string> = {
  Pending: 'ยังไม่ยืนยัน',
  Approved: 'ยืนยันแล้ว',
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
  selector: 'app-dormitory-detail',
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AuthImage,
    StatusBadge,
  ],
  templateUrl: './dormitory-detail.html',
  styleUrl: './dormitory-detail.scss',
})
export class DormitoryDetail implements OnInit {
  dorm = signal<DormitoryDetailModel | null>(null);
  loading = signal(true);
  processing = signal(false);
  activeImageIndex = signal(0);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: DormitoriesService,
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
        this.dorm.set(res.data);
        this.activeImageIndex.set(0);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.snackBar.open(err?.error?.message ?? 'โหลดข้อมูลไม่สำเร็จ', 'ปิด', {
          duration: 3000,
        });
        this.router.navigate(['/dormitories']);
      },
    });
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

  images(dorm: DormitoryDetailModel): string[] {
    if (!dorm.Dorm_Images) return [];
    try {
      const parsed = JSON.parse(dorm.Dorm_Images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  viewFullOwnershipProof(): void {
    const path = this.dorm()?.Ownership_Proof_Image;
    if (!path) return;
    this.imageViewer.openInNewTab(path).subscribe({
      error: () => {
        this.snackBar.open('เปิดเอกสารสิทธิ์ครอบครองไม่สำเร็จ', 'ปิด', { duration: 3000 });
      },
    });
  }

  approve(): void {
    const d = this.dorm();
    if (!d) return;

    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'อนุมัติหอพักนี้?',
        message: `คุณต้องการอนุมัติ "${d.Dorm_Name}" ใช่หรือไม่ หลังอนุมัติแล้วหอพักนี้จะแสดงต่อสาธารณะในแอปทันที`,
        confirmLabel: 'ยืนยันอนุมัติ',
        tone: 'primary',
        icon: 'check_circle',
      },
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.processing.set(true);
      this.service.approve(d.Dorm_ID).subscribe({
        next: () => {
          this.processing.set(false);
          this.snackBar.open('อนุมัติหอพักสำเร็จ', 'ปิด', { duration: 3000 });
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
    const d = this.dorm();
    if (!d) return;

    const ref = this.dialog.open(RejectDormitoryDialog, {
      width: '420px',
      data: { dormName: d.Dorm_Name },
    });

    ref.afterClosed().subscribe((adminNote: string | undefined) => {
      if (!adminNote) return;
      this.processing.set(true);
      this.service.reject(d.Dorm_ID, adminNote).subscribe({
        next: () => {
          this.processing.set(false);
          this.snackBar.open('ปฏิเสธหอพักแล้ว', 'ปิด', { duration: 3000 });
          this.load();
        },
        error: (err) => {
          this.processing.set(false);
          this.snackBar.open(err?.error?.message ?? 'ปฏิเสธไม่สำเร็จ', 'ปิด', {
            duration: 3000,
          });
        },
      });
    });
  }
}
