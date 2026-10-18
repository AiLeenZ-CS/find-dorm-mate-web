import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { inject } from '@angular/core';

export interface RejectOwnerDialogData {
  ownerName: string;
}

@Component({
  selector: 'app-reject-owner-dialog',
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './reject-owner-dialog.html',
  styleUrl: './reject-owner-dialog.scss',
})
export class RejectOwnerDialog {
  readonly data = inject<RejectOwnerDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RejectOwnerDialog>);

  adminNote = '';

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.dialogRef.close(this.adminNote.trim());
  }
}
