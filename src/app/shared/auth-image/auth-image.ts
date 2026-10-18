import { Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// 🚀 โหลดรูปภาพผ่าน backend image-proxy (ต้องแนบ JWT) แทนการ bind <img [src]> ตรงๆ
// เพราะ <img> ธรรมดาส่ง Authorization header ไม่ได้ - ที่นี่จึงดึงเป็น blob ผ่าน
// HttpClient (ที่มี auth interceptor แนบ token ให้อัตโนมัติ) แล้วค่อยแปลงเป็น object URL
// ถ้า src เป็น URL สาธารณะอยู่แล้ว (เช่น dicebear placeholder) จะ bind ตรงๆ โดยไม่ผ่าน backend
//
// 🚀 ใช้งานแบบใส่ class ตรงบน <app-auth-image class="avatar"> เหมือน <img> ปกติได้เลย
// (ไม่ใช้ imgClass input) เพราะ Angular ใส่ class ที่ tag นี้ให้กับ host element ของ component
// อยู่แล้ว ซึ่งอยู่ใน scope ของหน้าที่เรียกใช้ - CSS เดิมของแต่ละหน้าจึงยังใช้ได้ปกติไม่ต้องแก้
@Component({
  selector: 'app-auth-image',
  imports: [],
  templateUrl: './auth-image.html',
  styleUrl: './auth-image.scss',
})
export class AuthImage {
  src = input<string | null>(null);
  alt = input<string>('');
  fallback = input<string>('');

  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  objectUrl = signal<string | null>(null);
  loadFailed = signal(false);

  private currentBlobUrl: string | null = null;

  constructor() {
    effect(() => {
      this.loadImage(this.src());
    });

    this.destroyRef.onDestroy(() => this.revokeCurrent());
  }

  private loadImage(path: string | null): void {
    this.revokeCurrent();
    this.loadFailed.set(false);
    this.objectUrl.set(null);

    if (!path) return;

    const proxyPath = this.resolveBackendProxyPath(path);

    // ไม่ใช่ path ของ image-proxy ฝั่งเราเอง (เช่น dicebear placeholder) - ใช้ตรงๆ ได้เลย
    if (proxyPath === null) {
      this.objectUrl.set(path);
      return;
    }

    const fullUrl = `${environment.apiUrl}${proxyPath}`;
    this.http.get(fullUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.currentBlobUrl = url;
        this.objectUrl.set(url);
      },
      error: () => {
        this.loadFailed.set(true);
      },
    });
  }

  // 🚀 backend ส่ง ref ของรูปมา 2 แบบ: relative (เช่น "/admin/image-proxy?path=...") สำหรับ
  // เอกสารอ่อนไหว หรือ absolute URL (เช่น "http://10.0.2.2:3000/api/images/proxy?path=...")
  // สำหรับรูปทั่วไป - host ของแบบ absolute เป็น IP เฉพาะของ Android Emulator ใช้กับเบราว์เซอร์
  // บนเครื่อง Admin จริงไม่ได้ จึงต้องดึงมาแค่ path+query แล้วประกอบกับ environment.apiUrl ของ
  // Angular เองเสมอ ไม่เชื่อ host ที่ backend ฝังมาให้ - คืน null ถ้าไม่ใช่ proxy ของเราเอง
  // (เช่น URL ภายนอกจริงๆ อย่าง dicebear placeholder) ให้ไปใช้ตรงๆ แทน
  private resolveBackendProxyPath(value: string): string | null {
    if (!/^https?:\/\//.test(value)) {
      return value;
    }

    try {
      const url = new URL(value);
      if (url.pathname.includes('/images/proxy') || url.pathname.includes('/admin/image-proxy')) {
        // 🚀 ref แบบ absolute มี "/api" ติดมาด้วย (เช่น /api/images/proxy) แต่ environment.apiUrl
        // ก็ลงท้ายด้วย /api อยู่แล้ว ต้องตัด /api ที่ซ้ำออกก่อน ไม่งั้นจะกลายเป็น /api/api/...
        const pathname = url.pathname.startsWith('/api/') ? url.pathname.slice(4) : url.pathname;
        return `${pathname}${url.search}`;
      }
    } catch {
      return null;
    }

    return null;
  }

  private revokeCurrent(): void {
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
  }
}
