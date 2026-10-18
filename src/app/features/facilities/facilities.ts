import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Facilities as FacilitiesService } from '../../core/services/facilities';
import { Facility, FacilityType } from '../../core/models/facility.model';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-facilities',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './facilities.html',
  styleUrl: './facilities.scss',
})
export class FacilitiesPage implements OnInit {
  facilities = signal<Facility[]>([]);
  loading = signal(true);

  dormFacilities = computed(() =>
    this.facilities().filter((f) => f.Facility_Type === 'Dormitory'),
  );
  roomFacilities = computed(() => this.facilities().filter((f) => f.Facility_Type === 'Room'));

  newDormName = '';
  newRoomName = '';
  savingDorm = signal(false);
  savingRoom = signal(false);

  constructor(
    private readonly service: FacilitiesService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.service.list().subscribe({
      next: (res) => {
        this.facilities.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('โหลดข้อมูลสิ่งอำนวยความสะดวกไม่สำเร็จ', 'ปิด', { duration: 3000 });
      },
    });
  }

  add(type: FacilityType): void {
    const name = (type === 'Dormitory' ? this.newDormName : this.newRoomName).trim();
    if (!name) return;

    const saving = type === 'Dormitory' ? this.savingDorm : this.savingRoom;
    saving.set(true);

    this.service.create({ name, type }).subscribe({
      next: (res) => {
        saving.set(false);
        this.facilities.update((list) => [...list, res.data]);
        if (type === 'Dormitory') this.newDormName = '';
        else this.newRoomName = '';
      },
      error: (err) => {
        saving.set(false);
        this.snackBar.open(err?.error?.message ?? 'เพิ่มไม่สำเร็จ', 'ปิด', { duration: 3000 });
      },
    });
  }

  remove(facility: Facility): void {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'ลบสิ่งอำนวยความสะดวกนี้?',
        message: `ลบ "${facility.Facility_Name}" แล้วจะหลุดออกจากหอพัก/ห้องพักที่เคยเลือกไว้ทั้งหมดด้วย ต้องการดำเนินการต่อหรือไม่`,
        confirmLabel: 'ยืนยันลบ',
        tone: 'danger',
        icon: 'delete',
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.service.delete(facility.Facility_ID).subscribe({
        next: () => {
          this.facilities.update((list) =>
            list.filter((f) => f.Facility_ID !== facility.Facility_ID),
          );
          this.snackBar.open('ลบสำเร็จ', 'ปิด', { duration: 2000 });
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message ?? 'ลบไม่สำเร็จ', 'ปิด', { duration: 3000 });
        },
      });
    });
  }
}
