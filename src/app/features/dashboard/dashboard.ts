import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PendingOwners } from '../../core/services/pending-owners';
import { Dormitories } from '../../core/services/dormitories';
import { Reports } from '../../core/services/reports';
import { Admins } from '../../core/services/admins';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  pendingOwnerCount = signal<number | null>(null);
  pendingDormCount = signal<number | null>(null);
  pendingReportCount = signal<number | null>(null);
  adminCount = signal<number | null>(null);

  constructor(
    readonly auth: Auth,
    private readonly pendingOwners: PendingOwners,
    private readonly dormitories: Dormitories,
    private readonly reports: Reports,
    private readonly admins: Admins,
  ) {}

  ngOnInit(): void {
    this.pendingOwners.list('', 'Pending').subscribe({
      next: (res) => this.pendingOwnerCount.set(res.data.length),
      error: () => this.pendingOwnerCount.set(null),
    });

    this.dormitories.list('', 'Pending').subscribe({
      next: (res) => this.pendingDormCount.set(res.data.length),
      error: () => this.pendingDormCount.set(null),
    });

    this.reports.list('Pending').subscribe({
      next: (res) => this.pendingReportCount.set(res.data.length),
      error: () => this.pendingReportCount.set(null),
    });

    if (this.auth.isMasterAdmin()) {
      this.admins.list().subscribe({
        next: (res) => this.adminCount.set(res.data.length),
        error: () => this.adminCount.set(null),
      });
    }
  }
}
