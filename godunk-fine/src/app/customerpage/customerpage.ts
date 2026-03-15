import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customerpage',
  standalone: false,
  templateUrl: './customerpage.html',
  styleUrl: './customerpage.css',
})
export class Customerpage implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) {}

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

    // 2. สังเกตตรงนี้ครับ: ต้องใส่ url, options เข้าไปด้วย
    this.http.get<any>(url, options).subscribe({
      next: (data) => {
        console.log('✅ ข้อมูลเข้าแล้ว:', data);
        // ดักไว้เผื่อ API ส่งมาเป็น Object แทนที่จะเป็น Array
        if (Array.isArray(data)) {
          this.orders = data;
        } else {
          this.orders = [data]; // ถ้าเป็น Object ให้จับใส่ Array ให้มัน
        }
      },
      error: (err) => {
        console.error('❌ ดึงข้อมูลไม่สำเร็จ:', err);
        alert('ดึง API ไม่สำเร็จ! (กรุณากด F12 ดู Console)');
      }
    });
  }
}