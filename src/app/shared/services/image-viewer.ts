import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// 🚀 เปิดรูปที่ต้อง auth (เช่นรูปบัตรประชาชน/เอกสารสิทธิ์) แบบเต็มจอในแท็บใหม่
// ดึงเป็น blob ผ่าน HttpClient (แนบ JWT อัตโนมัติผ่าน auth interceptor ที่มีอยู่แล้ว) แล้วค่อยเปิด
// object URL แทนการเปิด URL ตรงๆ ซึ่งจะไม่มี header แนบไปด้วย
// (เดิมโค้ดนี้ซ้ำกันเป๊ะๆ ใน owner-detail.ts และ dormitory-detail.ts)
@Injectable({ providedIn: 'root' })
export class ImageViewer {
  private readonly http = inject(HttpClient);

  openInNewTab(path: string): Observable<void> {
    return this.http.get(`${environment.apiUrl}${path}`, { responseType: 'blob' }).pipe(
      map((blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank', 'noopener');
      }),
    );
  }
}
