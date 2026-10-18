import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Admins } from '../../../core/services/admins';
import { CreateAdminRequest } from '../../../core/models/admin.model';

@Component({
  selector: 'app-create-admin-dialog',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-admin-dialog.html',
  styleUrl: './create-admin-dialog.scss',
})
export class CreateAdminDialog {
  private readonly dialogRef = inject(MatDialogRef<CreateAdminDialog>);
  private readonly admins = inject(Admins);

  form: CreateAdminRequest = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  };

  saving = signal(false);
  errorMessage = signal<string | null>(null);

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.errorMessage.set(null);

    this.admins.create(this.form).subscribe({
      next: (res) => {
        this.saving.set(false);
        this.dialogRef.close(res.data);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err?.error?.message ?? 'เพิ่ม Admin ไม่สำเร็จ');
      },
    });
  }
}
