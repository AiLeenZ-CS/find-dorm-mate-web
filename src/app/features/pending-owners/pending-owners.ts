// 📄 ไฟล์นี้ทำหน้าที่: หน้ารายการคำร้องขอเป็นเจ้าของหอพักทั้งหมด ค้นหา/กรองตามสถานะ/จัดเรียง
// แล้วกดเข้าไปตรวจและอนุมัติ/ปฏิเสธแต่ละรายที่ owner-detail
import { Component, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Subject, debounceTime } from 'rxjs';
import { PendingOwners as PendingOwnersService } from '../../core/services/pending-owners';
import { OwnerAccount } from '../../core/models/owner.model';
import { AuthImage } from '../../shared/auth-image/auth-image';
import { StatusBadge, BadgeVariant } from '../../shared/status-badge/status-badge';
import { sortTableData } from '../../core/utils/table-sort';

const STATUS_LABEL: Record<string, string> = {
  Pending: 'รอตรวจสอบ',
  Approved: 'อนุมัติแล้ว',
  Rejected: 'ถูกปฏิเสธ',
  All: 'ทั้งหมด',
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
  selector: 'app-pending-owners',
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    AuthImage,
    StatusBadge,
  ],
  templateUrl: './pending-owners.html',
  styleUrl: './pending-owners.scss',
})
export class PendingOwners implements OnInit {
  owners = signal<OwnerAccount[]>([]);
  loading = signal(true);
  sort = signal<Sort>({ active: '', direction: '' });

  sortedOwners = computed(() =>
    sortTableData(this.owners(), this.sort(), {
      name: (o) => this.fullName(o).toLowerCase(),
      email: (o) => o.Email?.toLowerCase(),
      status: (o) => o.Status,
      submittedAt: (o) => (o.Submitted_Date ? new Date(o.Submitted_Date) : null),
    }),
  );

  search = '';
  status = 'All';

  private readonly searchChanged = new Subject<void>();
  readonly columns = ['name', 'email', 'status', 'submittedAt', 'actions'];

  constructor(
    private readonly service: PendingOwnersService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.searchChanged.pipe(debounceTime(350)).subscribe(() => this.refresh());
    this.refresh();
  }

  onSearchInput(): void {
    this.searchChanged.next();
  }

  onSortChange(sort: Sort): void {
    this.sort.set(sort);
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

  refresh(): void {
    this.loading.set(true);
    this.service.list(this.search, this.status).subscribe({
      next: (res) => {
        this.owners.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('โหลดรายการเจ้าของหอพักไม่สำเร็จ', 'ปิด', { duration: 3000 });
      },
    });
  }

  fullName(owner: OwnerAccount): string {
    return [owner.First_Name, owner.Last_Name].filter(Boolean).join(' ') || owner.Username;
  }

  viewDetail(owner: OwnerAccount): void {
    this.router.navigate(['/owners', owner.Owner_ID]);
  }
}
