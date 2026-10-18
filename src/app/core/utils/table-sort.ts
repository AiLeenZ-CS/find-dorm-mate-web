import { Sort } from '@angular/material/sort';

/**
 * เรียงข้อมูลตารางฝั่ง client ตาม Sort event ของ Angular Material (mat-sort-header)
 * ใช้ร่วมกันทุกหน้าที่มี mat-table เพื่อไม่ต้องเขียนลอจิกเรียงซ้ำแต่ละหน้า
 *
 * accessors: map จากชื่อคอลัมน์ (ต้องตรงกับ mat-sort-header="ชื่อ") ไปยังฟังก์ชันดึงค่าที่จะใช้เทียบ
 */
export function sortTableData<T>(
  data: readonly T[],
  sort: Sort,
  accessors: Record<string, (item: T) => string | number | Date | null | undefined>,
): T[] {
  const accessor = sort.active ? accessors[sort.active] : undefined;
  if (!sort.direction || !accessor) {
    return [...data];
  }

  const factor = sort.direction === 'asc' ? 1 : -1;

  return [...data].sort((a, b) => {
    const valueA = accessor(a);
    const valueB = accessor(b);

    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return factor; // ค่าว่างไปอยู่ท้ายเสมอไม่ว่าจะเรียง asc/desc
    if (valueB == null) return -factor;
    if (valueA < valueB) return -1 * factor;
    if (valueA > valueB) return 1 * factor;
    return 0;
  });
}
