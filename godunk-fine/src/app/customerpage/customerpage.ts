import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-customerpage',
  standalone: false,
  templateUrl: './customerpage.html',
  styleUrl: './customerpage.css',
})
export class Customerpage implements OnInit {
  orders: any[] = [];

  showUploadModal = false;
  showSlipModal = false;

  selectedOrder: any = null;
  selectedFile: File | null = null;
  selectedFileName = '';
  selectedFilePath = '';
  selectedPreview = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    const url = 'https://superlogically-unadministered-karyl.ngrok-free.dev/api/getorder';

    const options = {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    };

    this.http.get<any>(url, options).subscribe({
      next: (data) => {
        const rawOrders = Array.isArray(data) ? data : [data];

        this.orders = rawOrders.map((order: any) => ({
          ...order,
          transferStatus: order.transferStatus || order.tranwin || 'รอโอน',
          actionLabel:
            order.tranwin === 'โอนแล้ว' || order.transferStatus === 'โอนแล้ว'
              ? 'ตรวจสอบสลิป'
              : 'ยืนยันรับยอด',
          slipFile: null,
          slipName: order.imgpath ? order.imgpath.split('/').pop() : '',
          slipPath: order.imgpath || '',
          slipPreview: order.imgpath
            ? `https://superlogically-unadministered-karyl.ngrok-free.dev${order.imgpath}`
            : ''
        }));

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ ดึงข้อมูลไม่สำเร็จ:', err);
        alert('ดึง API ไม่สำเร็จ! (กรุณากด F12 ดู Console)');
      }
    });
  }

  openAction(order: any): void {
    if (order.actionLabel === 'ตรวจสอบสลิป') {
      this.openSlipPopup(order);
      return;
    }

    this.openUploadPopup(order);
  }

  openUploadPopup(order: any): void {
    this.selectedOrder = order;
    this.selectedFile = order.slipFile || null;
    this.selectedFileName = order.slipName || '';
    this.selectedFilePath = order.slipPath || '';
    this.selectedPreview = order.slipPreview || '';
    this.showUploadModal = true;
  }

  closeUploadPopup(): void {
    this.showUploadModal = false;
    this.selectedOrder = null;
    this.selectedFile = null;
    this.selectedFileName = '';
    this.selectedFilePath = '';
    this.selectedPreview = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.selectedFile = file;
    this.selectedFileName = file.name;


    const reader = new FileReader();
    reader.onload = () => {
      this.selectedPreview = reader.result as string;
      console.log('preview ready:', this.selectedPreview);
      this.cdr.detectChanges();
    };

    reader.onerror = () => {
      console.error('อ่านไฟล์รูปไม่สำเร็จ');
    };

    reader.readAsDataURL(file);
  }

  confirmUpload(): void {
  if (!this.selectedOrder || !this.selectedFile) {
    alert('กรุณาเลือกภาพก่อน');
    return;
  }

  const formData = new FormData();
  formData.append('image', this.selectedFile); // 🔥 สำคัญมาก
  formData.append('id', this.selectedOrder.id);
  formData.append('tranwin', 'โอนแล้ว');

  const url = 'https://superlogically-unadministered-karyl.ngrok-free.dev/api/update-tranwin';

  this.http.put(url, formData).subscribe({
    next: (res: any) => {
      console.log('อัปโหลดสำเร็จ:', res);

      // 🔥 ใช้ path ที่ backend ส่งกลับมา
      this.selectedOrder.slipPreview =
        'https://superlogically-unadministered-karyl.ngrok-free.dev/uploads/' + res.image;

      this.selectedOrder.transferStatus = 'โอนแล้ว';
      this.selectedOrder.actionLabel = 'ตรวจสอบสลิป';

      this.closeUploadPopup();
      this.fetchOrders();
    },
    error: (err) => {
      console.error(err);
      alert('อัปโหลดไม่สำเร็จ');
    }
  });
}

  openSlipPopup(order: any): void {
    this.selectedOrder = order;
    this.showSlipModal = true;
  }

  closeSlipPopup(): void {
    this.showSlipModal = false;
    this.selectedOrder = null;
  }

  getStatusClass(status: string): string {
    return status === 'โอนแล้ว' ? 'badge-success' : 'badge-warning';
  }


}