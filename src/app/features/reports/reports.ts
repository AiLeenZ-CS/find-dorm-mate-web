// 📄 ไฟล์นี้ทำหน้าที่: หน้ารายการรายงาน (report) ที่ผู้ใช้แจ้งเข้ามาทั้งหมด กรองตามสถานะ/จัดเรียง
// แล้วกดเข้าไปดูรายละเอียดและจัดการแต่ละเรื่องที่ report-detail
import { Component, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Reports as ReportsService } from '../../core/services/reports';
import { UserReport } from '../../core/models/report.model';
import { StatusBadge } from '../../shared/status-badge/status-badge';
import { sortTableData } from '../../core/utils/table-sort';

@Component({
  selector: 'app-reports',
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    StatusBadge,
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports implements OnInit {
  reports = signal<UserReport[]>([]);
  loading = signal(true);
  sort = signal<Sort>({ active: '', direction: '' });

  sortedReports = computed(() =>
    sortTableData(this.reports(), this.sort(), {
      reporter: (r) => r.Reporter?.Username?.toLowerCase(),
      reportedUser: (r) => r.Reported_User?.Username?.toLowerCase(),
      status: (r) => r.Status,
      reportedAt: (r) => (r.Reported_At ? new Date(r.Reported_At) : null),
    }),
  );

  status = 'All';
  readonly columns = ['reporter', 'reportedUser', 'reason', 'status', 'reportedAt', 'actions'];

  constructor(
    private readonly service: ReportsService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  onSortChange(sort: Sort): void {
    this.sort.set(sort);
  }

  refresh(): void {
    this.loading.set(true);
    this.service.list(this.status).subscribe({
      next: (res) => {
        this.reports.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('โหลดรายงานไม่สำเร็จ', 'ปิด', { duration: 3000 });
      },
    });
  }

  viewDetail(report: UserReport): void {
    this.router.navigate(['/reports', report.Report_ID]);
  }
}
