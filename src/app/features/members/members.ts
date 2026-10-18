import { Component, OnInit, computed, signal } from '@angular/core';
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
import { Members as MembersService } from '../../core/services/members';
import { MemberAccount } from '../../core/models/member.model';
import { AuthImage } from '../../shared/auth-image/auth-image';
import { StatusBadge } from '../../shared/status-badge/status-badge';
import { sortTableData } from '../../core/utils/table-sort';

@Component({
  selector: 'app-members',
  imports: [
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
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members implements OnInit {
  members = signal<MemberAccount[]>([]);
  loading = signal(true);
  sort = signal<Sort>({ active: '', direction: '' });

  sortedMembers = computed(() =>
    sortTableData(this.members(), this.sort(), {
      name: (m) => this.fullName(m).toLowerCase(),
      email: (m) => m.Email?.toLowerCase(),
      status: (m) => m.Account_Status,
    }),
  );

  search = '';
  status = 'All';

  private readonly searchChanged = new Subject<void>();
  readonly columns = ['name', 'email', 'status', 'actions'];

  constructor(
    private readonly service: MembersService,
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

  refresh(): void {
    this.loading.set(true);
    this.service.list(this.search, this.status).subscribe({
      next: (res) => {
        this.members.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('โหลดรายชื่อสมาชิกไม่สำเร็จ', 'ปิด', { duration: 3000 });
      },
    });
  }

  fullName(member: MemberAccount): string {
    return [member.First_Name, member.Last_Name].filter(Boolean).join(' ') || member.Username;
  }

  viewDetail(member: MemberAccount): void {
    this.router.navigate(['/members', member.Member_ID]);
  }
}
