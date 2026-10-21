// 📄 ไฟล์นี้ทำหน้าที่: หน้ารายการหอพักทั้งหมดในระบบ ค้นหา/กรองตามสถานะ/จัดเรียง
// แล้วกดเข้าไปดูรายละเอียดแต่ละหอพักต่อได้ที่ dormitory-detail
import { Component, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, debounceTime } from 'rxjs';
import { Dormitories as DormitoriesService } from '../../core/services/dormitories';
import { DormitoryListItem } from '../../core/models/dormitory.model';
import { AuthImage } from '../../shared/auth-image/auth-image';
import { StatusBadge, BadgeVariant } from '../../shared/status-badge/status-badge';

const STATUS_LABEL: Record<string, string> = {
  Pending: 'ยังไม่ยืนยัน',
  Approved: 'ยืนยันแล้ว',
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

type DormSortOption = 'created_desc' | 'created_asc' | 'name_asc' | 'name_desc';

const SORT_OPTIONS: { value: DormSortOption; label: string }[] = [
  { value: 'created_desc', label: 'ลงประกาศล่าสุดก่อน' },
  { value: 'created_asc', label: 'ลงประกาศเก่าสุดก่อน' },
  { value: 'name_asc', label: 'ชื่อหอพัก ก-ฮ' },
  { value: 'name_desc', label: 'ชื่อหอพัก ฮ-ก' },
];

@Component({
  selector: 'app-dormitories',
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    AuthImage,
    StatusBadge,
  ],
  templateUrl: './dormitories.html',
  styleUrl: './dormitories.scss',
})
export class Dormitories implements OnInit {
  dorms = signal<DormitoryListItem[]>([]);
  loading = signal(true);
  sortOption = signal<DormSortOption>('created_desc');
  readonly sortOptions = SORT_OPTIONS;

  sortedDorms = computed(() => {
    const list = [...this.dorms()];
    switch (this.sortOption()) {
      case 'name_asc':
        return list.sort((a, b) => a.Dorm_Name.localeCompare(b.Dorm_Name, 'th'));
      case 'name_desc':
        return list.sort((a, b) => b.Dorm_Name.localeCompare(a.Dorm_Name, 'th'));
      case 'created_asc':
        return list.sort(
          (a, b) => new Date(a.Created_At).getTime() - new Date(b.Created_At).getTime(),
        );
      case 'created_desc':
      default:
        return list.sort(
          (a, b) => new Date(b.Created_At).getTime() - new Date(a.Created_At).getTime(),
        );
    }
  });

  search = '';
  status = 'All';

  private readonly searchChanged = new Subject<void>();

  constructor(
    private readonly service: DormitoriesService,
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
        this.dorms.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('โหลดรายการหอพักไม่สำเร็จ', 'ปิด', { duration: 3000 });
      },
    });
  }

  firstImage(dorm: DormitoryListItem): string {
    if (!dorm.Dorm_Images) return '';
    try {
      const images = JSON.parse(dorm.Dorm_Images);
      return Array.isArray(images) && images.length > 0 ? images[0] : '';
    } catch {
      return '';
    }
  }

  viewDetail(dorm: DormitoryListItem): void {
    this.router.navigate(['/dormitories', dorm.Dorm_ID]);
  }
}
