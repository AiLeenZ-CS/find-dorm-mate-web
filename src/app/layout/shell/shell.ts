// 📄 ไฟล์นี้ทำหน้าที่: โครง layout หลักของแอดมิน (sidenav เมนู + topbar) ที่ครอบทุกหน้า
// หลังล็อกอิน ให้ RouterOutlet แสดงเนื้อหาแต่ละหน้าอยู่ภายใน
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
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
    MatButtonModule,
    MatDividerModule,
    AuthImage,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell implements OnInit {
  // 🚀 จอเล็กกว่า 768px (มือถือ/แท็บเล็ตแนวตั้ง) ให้ sidenav เริ่มต้นซ่อนไว้ แบบ overlay
  // ทับเนื้อหา (mode="over") แทนที่จะโชว์ค้างแบบจอใหญ่ (mode="side") ที่จะกินพื้นที่จนเนื้อหาบีบแคบ
  isMobile = signal(false);
  sidenavOpened = signal(true);

  constructor(
    readonly auth: Auth,
    private readonly profileService: Profile,
    private readonly breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 768px)').subscribe((result) => {
      this.isMobile.set(result.matches);
      this.sidenavOpened.set(!result.matches);
    });

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

  toggleSidenav(): void {
    this.sidenavOpened.update((v) => !v);
  }

  // 🚀 กดลิงก์เมนูบนมือถือแล้วปิด sidenav ทับเนื้อหาให้เองเลย ไม่ต้องกดปิดเอง
  onNavClick(): void {
    if (this.isMobile()) this.sidenavOpened.set(false);
  }

  logout(): void {
    this.auth.logout();
  }
}
