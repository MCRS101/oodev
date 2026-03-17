import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-purchase-order',
  standalone: false,
  templateUrl: './purchase-order.html',
  styleUrl: './purchase-order.css',
})
export class PurchaseOrder implements OnInit {
  orders: any[] = [];
  isModalOpen: boolean = false; 
  selectedOrder: any = null; 

  // --- ส่วนที่เตรียมไว้สำหรับปุ่มอัปเดต ---
  isUpdatingStatus: boolean = false; 

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
      
    const options = {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    };
    this.http.get<any[]>('https://superlogically-unadministered-karyl.ngrok-free.dev/api/getorder', options).subscribe((res) => {
      this.orders = res.map((o) => ({
        po: o.id,
        customer: o.user.name,
        date: o.createdAt,
        total: o.total,
        status: o.status,
        raw_data: o,
        Image: o.image
      }));
      this.cdr.detectChanges();
    });
  }

  openDetail(item: any) {
    this.selectedOrder = item;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }

 async updateStatus(newStatus: string) {
    if (this.isUpdatingStatus) return;
    this.isUpdatingStatus = true;

    // ข้อมูลที่ส่งไปหาเพื่อน (ต้องมี id และ status)
    const body = {
      id: this.selectedOrder.po, 
      status: newStatus          
    };

    const options = {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    };

    // ยิงไปที่ Endpoint ที่เพื่อนให้มา
    this.http.put('https://superlogically-unadministered-karyl.ngrok-free.dev/api/updatestautus', body, options)
      .subscribe({
        next: (res) => {
          alert(`อัปเดตออเดอร์หมายเลข ${body.id} เป็น "${newStatus}" สำเร็จ!`);
          this.loadOrders(); // รีเฟรชตารางหน้าแรก
          this.closeModal(); // ปิด Modal
          this.isUpdatingStatus = false;
        },
        error: (err) => {
          console.error('Update Error:', err);
          alert('ไม่สามารถอัปเดตได้: ' + (err.error?.message || 'เซิร์ฟเวอร์ขัดข้อง'));
          this.isUpdatingStatus = false;
        }
      });
  }
    onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://placehold.co/48x48?text=No+Img';
  }
}