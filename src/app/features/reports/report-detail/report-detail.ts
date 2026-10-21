// 📄 ไฟล์นี้ทำหน้าที่: หน้ารายละเอียดรายงาน (report) ที่ผู้ใช้แจ้งเข้ามาทีละเรื่อง
// ให้แอดมินดูรายละเอียดแล้วปิด/เปิดเรื่องกลับมารอดำเนินการได้
import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Reports as ReportsService } from '../../../core/services/reports';
import { UserReport } from '../../../core/models/report.model';
import { StatusBadge } from '../../../shared/status-badge/status-badge';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-report-detail',
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    StatusBadge,
  ],
  templateUrl: './report-detail.html',
  styleUrl: './report-detail.scss',
})
export class ReportDetail implements OnInit {
  report = signal<UserReport | null>(null);
  loading = signal(true);
  processing = signal(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: ReportsService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);
    this.service.detail(id).subscribe({
      next: (res) => {
        this.report.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.snackBar.open(err?.error?.message ?? 'โหลดข้อมูลไม่สำเร็จ', 'ปิด', {
          duration: 3000,
        });
        this.router.navigate(['/reports']);
      },
    });
  }

  toggleStatus(): void {
    const r = this.report();
    if (!r) return;
    const willResolve = r.Status !== 'Resolved';
    const nextStatus = willResolve ? 'Resolved' : 'Pending';

    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: willResolve ? 'ปิดเรื่องรายงานนี้?' : 'เปิดเรื่องรายงานนี้ใหม่?',
        message: willResolve
          ? 'คุณตรวจสอบและดำเนินการเรียบร้อยแล้วใช่หรือไม่ รายงานนี้จะถูกทำเครื่องหมายว่าดำเนินการแล้ว'
          : 'คุณต้องการเปิดเรื่องนี้กลับมาเป็นรอดำเนินการอีกครั้งใช่หรือไม่',
        confirmLabel: willResolve ? 'ยืนยันปิดเรื่อง' : 'ยืนยันเปิดเรื่องใหม่',
        tone: 'primary',
        icon: willResolve ? 'check_circle' : 'restart_alt',
      },
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.processing.set(true);
      this.service.updateStatus(r.Report_ID, nextStatus).subscribe({
        next: () => {
          this.processing.set(false);
          this.snackBar.open(
            nextStatus === 'Resolved' ? 'ปิดเรื่องแล้ว' : 'เปิดเรื่องใหม่แล้ว',
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
