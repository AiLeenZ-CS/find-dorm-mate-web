import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../core/services/auth';
import { Profile as ProfileService } from '../../core/services/profile';
import { MyProfile } from '../../core/models/profile.model';
import { AuthImage } from '../../shared/auth-image/auth-image';
import { StatusBadge } from '../../shared/status-badge/status-badge';

const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    AuthImage,
    StatusBadge,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileScreen implements OnInit {
  profile = signal<MyProfile | null>(null);
  loading = signal(true);
  saving = signal(false);
  uploadingAvatar = signal(false);
  changingPassword = signal(false);
  sendingResetEmail = signal(false);

  form = { firstName: '', lastName: '', phone: '' };
  passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };

  constructor(
    readonly auth: Auth,
    private readonly service: ProfileService,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const id = this.auth.currentUser()?.Member_ID;
    if (!id) return;

    this.loading.set(true);
    this.service.get(id).subscribe({
      next: (res) => {
        this.profile.set(res.data);
        this.form = {
          firstName: res.data.First_Name ?? '',
          lastName: res.data.Last_Name ?? '',
          phone: res.data.Phone ?? '',
        };
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.snackBar.open(err?.error?.message ?? 'โหลดข้อมูลไม่สำเร็จ', 'ปิด', { duration: 3000 });
      },
    });
  }

  roleLabel(role: string | undefined): string {
    return role === 'Master_Admin' ? 'Master Admin' : 'Admin';
  }

  // 🚀 ตัดอักขระที่ไม่ใช่ตัวเลขออกทันทีที่พิมพ์ + จำกัดไม่เกิน 10 หลัก (ความถูกต้องของรูปแบบ
  // "ขึ้นต้นด้วย 0" เช็คซ้ำอีกชั้นด้วย pattern validator บน input เอง)
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '').slice(0, 10);
    if (digitsOnly !== input.value) {
      input.value = digitsOnly;
    }
    this.form.phone = digitsOnly;
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      this.snackBar.open('รองรับเฉพาะไฟล์รูปภาพ JPEG, PNG หรือ WEBP เท่านั้น', 'ปิด', {
        duration: 3000,
      });
      return;
    }

    this.uploadingAvatar.set(true);
    this.service.uploadAvatar(file).subscribe({
      next: (uploadRes) => {
        this.service.update({ profileImage: uploadRes.data.path }).subscribe({
          next: (updateRes) => {
            this.uploadingAvatar.set(false);
            this.profile.set(updateRes.data);
            this.auth.setProfileImage(updateRes.data.Profile_Image);
            this.snackBar.open('เปลี่ยนรูปโปรไฟล์สำเร็จ', 'ปิด', { duration: 3000 });
          },
          error: (err) => {
            this.uploadingAvatar.set(false);
            this.snackBar.open(err?.error?.message ?? 'บันทึกรูปโปรไฟล์ไม่สำเร็จ', 'ปิด', {
              duration: 3000,
            });
          },
        });
      },
      error: (err) => {
        this.uploadingAvatar.set(false);
        this.snackBar.open(err?.error?.message ?? 'อัปโหลดรูปไม่สำเร็จ', 'ปิด', { duration: 3000 });
      },
    });
  }

  saveProfile(): void {
    this.saving.set(true);
    this.service
      .update({
        firstName: this.form.firstName.trim(),
        lastName: this.form.lastName.trim(),
        phone: this.form.phone.trim(),
      })
      .subscribe({
        next: (res) => {
          this.saving.set(false);
          this.profile.set(res.data);
          this.snackBar.open('บันทึกข้อมูลส่วนตัวสำเร็จ', 'ปิด', { duration: 3000 });
        },
        error: (err) => {
          this.saving.set(false);
          this.snackBar.open(err?.error?.message ?? 'บันทึกไม่สำเร็จ', 'ปิด', { duration: 3000 });
        },
      });
  }

  changePassword(): void {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.snackBar.open('รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน', 'ปิด', { duration: 3000 });
      return;
    }
    if (this.passwordForm.newPassword.length < 6) {
      this.snackBar.open('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร', 'ปิด', { duration: 3000 });
      return;
    }

    this.changingPassword.set(true);
    this.service
      .changePassword(this.passwordForm.oldPassword, this.passwordForm.newPassword)
      .subscribe({
        next: () => {
          this.changingPassword.set(false);
          this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
          this.snackBar.open('เปลี่ยนรหัสผ่านสำเร็จ', 'ปิด', { duration: 3000 });
        },
        error: (err) => {
          this.changingPassword.set(false);
          this.snackBar.open(err?.error?.message ?? 'เปลี่ยนรหัสผ่านไม่สำเร็จ', 'ปิด', {
            duration: 3000,
          });
        },
      });
  }

  sendResetEmail(): void {
    const email = this.profile()?.Email;
    if (!email) return;

    this.sendingResetEmail.set(true);
    this.service.forgotPassword(email).subscribe({
      next: (res) => {
        this.sendingResetEmail.set(false);
        this.snackBar.open(res.message ?? 'ส่งอีเมลสำเร็จ', 'ปิด', { duration: 4000 });
      },
      error: (err) => {
        this.sendingResetEmail.set(false);
        this.snackBar.open(err?.error?.message ?? 'ส่งอีเมลไม่สำเร็จ', 'ปิด', { duration: 3000 });
      },
    });
  }
}
