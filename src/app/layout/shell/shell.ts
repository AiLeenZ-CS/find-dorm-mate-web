import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Auth } from '../../core/services/auth';
import { Profile } from '../../core/services/profile';
import { AuthImage } from '../../shared/auth-image/auth-image';

@Component({
  selector: 'app-shell',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    AuthImage,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell implements OnInit {
  constructor(
    readonly auth: Auth,
    private readonly profileService: Profile,
  ) {}

  ngOnInit(): void {
    // 🚀 ดึงรูปโปรไฟล์มาเติมให้ topbar (login response ไม่มีฟิลด์นี้มาด้วย)
    const id = this.auth.currentUser()?.Member_ID;
    if (!id) return;

    this.profileService.get(id).subscribe({
      next: (res) => this.auth.setProfileImage(res.data.Profile_Image),
      error: () => {
        // ไม่ critical — แค่โชว์ไอคอน default แทนถ้าโหลดไม่สำเร็จ
      },
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
