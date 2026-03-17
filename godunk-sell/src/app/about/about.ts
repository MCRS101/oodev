import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit{
user: any = null;
constructor( private http: HttpClient) {
    // ดึงข้อมูล user จาก localStorage ตอนเริ่มต้น
    const u = localStorage.getItem('user');
    if (u) {
      this.user = JSON.parse(u);
    }
  }
  ngOnInit(): void {}
  saveProfile() {
    // ส่งข้อมูล user ล่าสุดในตัวแปร user ไปที่ API
    this.http.put('https://superlogically-unadministered-karyl.ngrok-free.dev/api/update-profile', this.user).subscribe({
      next: (res: any) => {
        alert('บันทึกข้อมูลสำเร็จ');
        // 3. สั่ง Reload หน้าจอเพื่อให้ข้อมูลใหม่แสดงผลทุกจุด
      window.location.reload();
        // อัปเดตข้อมูลใน localStorage ให้เป็นตัวใหม่ล่าสุด
        localStorage.setItem('user', JSON.stringify(res.user));
        this.user = res.user;
         
      },
      error: (err) => {
        alert('เกิดข้อผิดพลาด: ' + err.error.message);
      }
    });
    }
}
