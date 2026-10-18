import { Component, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Admins } from '../../core/services/admins';
import { AdminAccount } from '../../core/models/admin.model';
import { CreateAdminDialog } from './create-admin-dialog/create-admin-dialog';
import { AuthImage } from '../../shared/auth-image/auth-image';
import { StatusBadge } from '../../shared/status-badge/status-badge';
import { sortTableData } from '../../core/utils/table-sort';

@Component({
  selector: 'app-manage-admins',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    AuthImage,
    StatusBadge,
  ],
  templateUrl: './manage-admins.html',
  styleUrl: './manage-admins.scss',
})
export class ManageAdmins implements OnInit {
  admins = signal<AdminAccount[]>([]);
  loading = signal(true);
  sort = signal<Sort>({ active: '', direction: '' });

  sortedAdmins = computed(() =>
    sortTableData(this.admins(), this.sort(), {
      name: (a) => this.fullName(a).toLowerCase(),
      email: (a) => a.Email?.toLowerCase(),
      role: (a) => a.User_Role,
      status: (a) => a.Account_Status,
      createdAt: (a) => (a.Created_At ? new Date(a.Created_At) : null),
    }),
  );

  readonly columns = ['name', 'email', 'role', 'status', 'createdAt', 'actions'];

  constructor(
    private readonly service: Admins,
    private readonly router: Router,
    private readonly dialog: MatDialog,
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
    this.service.list().subscribe({
      next: (res) => {
        this.admins.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('โหลดรายชื่อ Admin ไม่สำเร็จ', 'ปิด', { duration: 3000 });
      },
    });
  }

  fullName(admin: AdminAccount): string {
    return [admin.First_Name, admin.Last_Name].filter(Boolean).join(' ') || admin.Username;
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(CreateAdminDialog, { width: '480px' });
    ref.afterClosed().subscribe((created) => {
      if (created) {
        this.snackBar.open('เพิ่ม Admin สำเร็จ', 'ปิด', { duration: 3000 });
        this.refresh();
      }
    });
  }

  viewDetail(admin: AdminAccount): void {
    this.router.navigate(['/manage-admins', admin.Member_ID]);
  }
}
