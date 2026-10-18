import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface RejectDormitoryDialogData {
  dormName: string;
}

@Component({
  selector: 'app-reject-dormitory-dialog',
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './reject-dormitory-dialog.html',
  styleUrl: './reject-dormitory-dialog.scss',
})
export class RejectDormitoryDialog {
  readonly data = inject<RejectDormitoryDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RejectDormitoryDialog>);

  adminNote = '';

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    if (!this.adminNote.trim()) return;
    this.dialogRef.close(this.adminNote.trim());
  }
}
